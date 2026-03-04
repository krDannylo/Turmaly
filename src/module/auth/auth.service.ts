import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HashingServiceProtocol } from "src/common/hash/hashing.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRole } from '@prisma/client';
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from '@nestjs/config';
import { EmailAlreadyInUseException, InvalidCredentialsException, InvalidRoleException, UserNotFoundException } from "./exceptions/auth.exception";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import { SignUpResponseDto } from "./dto/sign-up-response.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,

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

        const passwordIsValid = await this.hashingService.compare(
            password,
            user.password
        );

        if (!passwordIsValid) throw new InvalidCredentialsException();
        
        const token = await this.generateToken(user, user.role)

        return {
            name: user.name,
            email: user.email,
            role: user.role,
            token
        };
    }

    async register(singUpDto: SignUpDto): Promise<SignUpResponseDto> {
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

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            // ...(role === UserRole.TEACHER && { teacher: profile }),
            // ...(role === UserRole.STUDENT && { student: profile }),
        };
    }
}