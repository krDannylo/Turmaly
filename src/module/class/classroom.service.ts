import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { ClassroomType } from "@prisma/client";

@Injectable()
export class ClassroomService {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(createClassroomDto: CreateClassroomDto, teacherId: number) {
        // Verificar possibilidade de manter essa lógica junto do AuthGuard
        // Para nao precisar repetir ela a todo mundo que eu quiser dado do token
        const existingTeacher = await this.prisma.teacher.findUnique({
            where: { id: teacherId }
        })

         if (!existingTeacher) throw new HttpException("Teacher not found", HttpStatus.NOT_FOUND)

        const existingClassroom = await this.prisma.classroom.findUnique({
            where: { 
                name: createClassroomDto.name,
                teacherId,
            }
        })

        if (existingClassroom) throw new HttpException("Classroom already Exist", HttpStatus.CONFLICT)

        const classroom = await this.prisma.classroom.create({
            data: {
                name: createClassroomDto.name,
                type: createClassroomDto.type,
                teacherId: teacherId
            },
            include: {
                teacher: {
                    select: { name: true }
                }
            }
        })

        return classroom;
    }

    async findOne(id: number) {
        const classroom = await this.prisma.classroom.findFirst({
            where: { id }
        })

        if (!classroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

        return classroom
    }

    async findAll(teacherId: number) {
        const existingTeacher = await this.prisma.teacher.findUnique({
            where: { id: teacherId }
        })

        if (!existingTeacher) throw new HttpException("Teacher not found", HttpStatus.NOT_FOUND)

        const classrooms = await this.prisma.classroom.findMany({
            where: { teacherId }
        })

        return classrooms
    }

    async updateById(id: number, updateClassroomDto: UpdateClassroomDto) {
        const existingClassroom = await this.findOne(id)

        if (!existingClassroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

        const updateData: { name?: string, type?: ClassroomType } = {
            name: updateClassroomDto.name ? updateClassroomDto.name : existingClassroom.name,
            type: updateClassroomDto.type ? updateClassroomDto.type : existingClassroom.type
        }

        const updatedClassroom = await this.prisma.classroom.update({
            where: { id: existingClassroom.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                type: true,
            }
        })

        return updatedClassroom;
    }
}