import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { HashingServiceProtocol } from "src/common/hash/hashing.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRole } from '@prisma/client';
import jwtConfig from "./config/jwt.config";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import { SignUpResponseDto } from "./dto/sign-up-response.dto";
import { EmailQueue } from "./jobs/email-queue";
import { randomBytes, randomUUID } from "crypto";
import { 
    EmailAlreadyInUseException, 
    EmailAlreadyVerified, 
    EmailNotVerified, 
    InvalidCredentialsException, 
    InvalidRoleException, 
    UserNotFoundException 
} from "./exceptions/auth.exception";
import type { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,
        private readonly emailQueue: EmailQueue,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
        
    ){ }

    private async generateToken(user: {id: number; email: string}, role: UserRole): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
                role
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer
            }
        )
    }

    async authenticate(signInDto: SignInDto): Promise<SignInResponseDto> {
        const { email, password } = signInDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                teacher: true,
                student: true
            }
        })

        if(!user) throw new UserNotFoundException();
        if(!user.emailVerified) throw new EmailNotVerified();

        const passwordIsValid = await this.hashingService.compare(
            password,
            user.password
        );

        if (!passwordIsValid) throw new InvalidCredentialsException();
        
        const token = await this.generateToken(user, user.role)

        const refreshTokenId = randomUUID();
        const refreshTokenValue = randomBytes(64).toString("hex")
        const refreshToken = `${refreshTokenId}.${refreshTokenValue}`

        await this.refreshTokenRegister(refreshTokenId, refreshTokenValue, user.id)

        return {
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            refreshToken
        };
    }

    async register(singUpDto: SignUpDto): Promise<SignUpResponseDto> {
        try{
            const { name, email, password } = singUpDto;
            const role = singUpDto.role.toLocaleUpperCase() as UserRole;

            const allowedRoles: UserRole[] = [UserRole.STUDENT, UserRole.TEACHER];

            if(!allowedRoles.includes(role)) throw new InvalidRoleException();
            
            const userExists = await this.prisma.user.findUnique({
                where: { email },
            });

            if (userExists) throw new EmailAlreadyInUseException();

            const passwordHash = await this.hashingService.hash(password);

            const [user] = await this.prisma.$transaction(async (prisma) => {
                const createdUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: passwordHash,
                        role,
                        emailVerified: false
                    },
                });

                let createdProfile;
                if (role === UserRole.TEACHER) {
                    createdProfile = await prisma.teacher.create({
                        data: { user: { connect: { id: createdUser.id } } },
                        select: { id: true },
                    });
                } else {
                    createdProfile = await prisma.student.create({
                        data: { user: { connect: { id: createdUser.id } } },
                        select: { id: true },
                    });
                }

                return [createdUser, createdProfile];
            });

            await this.emailQueue.sendVerificationEmail(user)

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                // ...(role === UserRole.TEACHER && { teacher: profile }),
                // ...(role === UserRole.STUDENT && { student: profile }),
            };
        } catch(err){
            console.log(err)
            throw err
        }
    }

    async refreshToken(refreshToken: string){
        const [tokenId, tokenValue] = refreshToken.split(".")

        if(!tokenId || !tokenValue) throw new UnauthorizedException("Invalid token format");

        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { id: tokenId },
            include: { user: true}
        })

        if(!storedToken) throw new UnauthorizedException("Refresh token not found");

        if (storedToken.expires_at < new Date()){
            throw new UnauthorizedException("Refresh token expired");
        }

        const isValid = await this.hashingService.compare(tokenValue, storedToken.refreshTokenHash);
        if (!isValid) throw new UnauthorizedException("Invalid refresh token");

        const user = storedToken.user;
        if (!user) throw new UserNotFoundException();

        const newAccessToken = await this.generateToken(user, user.role);

        const newRefreshTokenValue = randomBytes(64).toString("hex");
        const newRefreshTokenId = randomUUID();
        await this.refreshTokenRegister(newRefreshTokenId, newRefreshTokenValue, user.id);

        return {
            token: newAccessToken,
            refreshToken: `${newRefreshTokenId}.${newRefreshTokenValue}`
        };
    }

    async refreshTokenRegister(refreshTokenId: string, refreshTokenValue: string, userId: number){
        const hashedRefreshToken = await this.hashingService.hash(refreshTokenValue)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await this.prisma.refreshToken.upsert({
            where: { id: refreshTokenId },
            update: {
                refreshTokenHash: hashedRefreshToken,
                userId,
                expires_at: expiresAt
            },
            create: {
                id: refreshTokenId,
                refreshTokenHash: hashedRefreshToken,
                userId,
                expires_at: expiresAt
            }
        });
    }

    async validateEmail(token: string){
        const payload = this.jwtService.verify(token)

        if(payload.type !== 'email-verification'){
            throw new UnauthorizedException('Invalid token type')
        }

        await this.updateEmailToVerified(payload.sub)
        return {
            message: 'Email Verified Successfully'
        }
    }

    async updateEmailToVerified(userId: number){
        const user = await this.prisma.user.findFirst({
            where: { id: userId }
        })

        if(user?.emailVerified) throw new EmailAlreadyVerified()

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true
            }
        })
    }

}