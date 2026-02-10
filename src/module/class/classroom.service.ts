import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { ClassroomType } from "@prisma/client";
import { PaginationQueryDto } from "src/common/dto/pagination.dto";

@Injectable()
export class ClassroomService {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(createClassroomDto: CreateClassroomDto, teacherId: number) {
        // Verificar possibilidade de manter essa lógica junto do AuthGuard
        // Para nao precisar repetir ela em todo mundo que eu quiser dados do token
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

    async findAllPaginated(teacherId: number, paginationQueryDto: PaginationQueryDto) {

        const MAX_LIMIT = 50;
        const { page = 1, limit = 10 } = paginationQueryDto;
        const safeLimit = Math.min(limit, MAX_LIMIT)
        const skip = (page - 1) * safeLimit;

        const existingTeacher = await this.prisma.teacher.findUnique({
            where: { id: teacherId }
        })

        if (!existingTeacher) throw new HttpException("Teacher not found", HttpStatus.NOT_FOUND)

        const [classrooms, total] = await Promise.all([
            this.prisma.classroom.findMany({
                where: { teacherId },
                include: { lessons: true, posts: true },
                skip,
                take: limit,
                orderBy: { id: 'asc' }
            }),
            this.prisma.classroom.count({
                where: { teacherId }
            })
        ])

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data: classrooms,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        }
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

    async deleteById(id: number) {
        const existingClassroom = await this.findOne(id)

        if (!existingClassroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

        await this.prisma.classroom.delete({
            where: { id }
        })

        return {
            statusCode: HttpStatus.OK,
            message: "Classroom deleted"
        }
    }
}