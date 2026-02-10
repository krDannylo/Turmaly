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
        const teacher = await this.prisma.teacher.findFirst({
            where: {
                email: signInDto.email
            }
        })
        
        if(teacher){
            const passwordIsValid = await this.hashingService.compare(
                signInDto.password, teacher.password
            )

            if(!passwordIsValid) throw new HttpException("Senha/Usuário Incorretos", HttpStatus.BAD_REQUEST)
            
            const token = await this.generateToken(teacher, UserRole.TEACHER)

            return {
                name: teacher.name,
                email: teacher.email,
                token
            }
        }
        throw new HttpException("Dados não encontrados", HttpStatus.NOT_FOUND)
    }

    async register(singUpDto: SignUpDto) {
        const userRole = singUpDto.role.toLocaleLowerCase()

        if(userRole === UserRole.TEACHER){

            if(!singUpDto.email || !singUpDto.password ) throw new HttpException("Body Failed", HttpStatus.BAD_GATEWAY)

            const existingEmail = await this.prisma.teacher.findUnique({
                where: { email: singUpDto.email }
            })

            if (existingEmail) throw new HttpException("Email Conflict", HttpStatus.CONFLICT)
            
            const passwordHash = await this.hashingService.hash(singUpDto.password)
            const newTeacher = await this.prisma.teacher.create({
                data: {
                    name: singUpDto.name,
                    email: singUpDto.email,
                    password: passwordHash
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            })

            return newTeacher
        }
        throw new HttpException("Dados não encontrados", HttpStatus.NOT_FOUND)
    }
}