import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HashingServiceProtocol } from "src/common/hash/hashing.service";
import type { ConfigType } from '@nestjs/config';
import jwtConfig from "./config/jwt.config";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from './common/user-type.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
        
    ){ }

    private async generateToken(user: {id: number; email: string}, role: UserRole) {
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

    async authenticate(signInDto: SignInDto) {
        const { email, password } = signInDto;

        const [teacher, student] = await Promise.all([
            this.prisma.teacher.findFirst({where: { email }}),
            this.prisma.student.findFirst({where: { email }}),
        ])

        const user = teacher ?? student;

        if(!user) throw new HttpException("Dados não encontrados", HttpStatus.NOT_FOUND);

        const passwordIsValid = await this.hashingService.compare(
            password,
            user.password
        );

        if (!passwordIsValid) throw new HttpException("Senha/Usuário Incorretos", HttpStatus.BAD_REQUEST);

        const role = teacher ? UserRole.TEACHER : UserRole.STUDENT
        const token = await this.generateToken(user, role)

        return {
            name: user.name,
            email: user.email,
            token
        }
    }

    async register(singUpDto: SignUpDto) {
        const { name, email, password } = singUpDto;
        const role = singUpDto.role.toLocaleUpperCase() as UserRole;

        const allowedRoles: UserRole[] = [UserRole.STUDENT, UserRole.TEACHER];

        if(!allowedRoles.includes(role)) {
            throw new HttpException("Role Invalid", HttpStatus.BAD_REQUEST);
        }

        if(!email || !password) {
            throw new HttpException("Body Failed", HttpStatus.BAD_REQUEST);
        }

        const [teacherExists, studentExists] = await Promise.all([
            this.prisma.teacher.findUnique({ where: { email } }),
            this.prisma.student.findUnique({ where: { email } }),
        ]);

        if (teacherExists || studentExists) {
            throw new HttpException("Email Conflict", HttpStatus.CONFLICT);
        }

        const passwordHash = await this.hashingService.hash(password);

        const data = {
            name,
            email,
            password: passwordHash
        };

        if (role == UserRole.TEACHER) {
            return this.prisma.teacher.create({
                data,
                select: { id: true, name: true, email: true },
            });
        }

        return this.prisma.student.create({
            data,
            select: { id: true, name: true, email: true },
        })
    }
}