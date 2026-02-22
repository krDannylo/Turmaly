import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { PrismaService } from "../prisma/prisma.service";
import { HashingServiceProtocol } from "../../common/hash/hashing.service";

@Injectable()
export class TeacherService {
    constructor(
        private prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol
    ) {}

    // async create(createTeacherDto: CreateTeacherDto) {
    //     const existingEmail = await this.prisma.teacher.findUnique({
    //         where: { email: createTeacherDto.email }
    //     })

    //     if (existingEmail) throw new HttpException("Email Conflict", HttpStatus.CONFLICT)
        
    //     const passwordHash = await this.hashingService.hash(createTeacherDto.password)
    //     const newTeacher = await this.prisma.teacher.create({
    //         data: {
    //             name: createTeacherDto.name,
    //             email: createTeacherDto.email,
    //             password: passwordHash,
    //         },
    //         select: {
    //             id: true,
    //             name: true,
    //             email: true
    //         }
    //     })

    //     return newTeacher;
    // }

    // async findOne(id: number){
    //     const teacher = await this.prisma.teacher.findFirst({
    //         where: { id },
    //         select: {
    //             id: true,
    //             name: true,
    //             email: true
    //         }
    //     })

    //     if(!teacher) throw new HttpException("Professor não encontrado", HttpStatus.NOT_FOUND);

    //     return teacher;
    // }
}