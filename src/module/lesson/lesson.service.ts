import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
    constructor(
        private prisma: PrismaService
    ) { }

    // async create(createLessonDto: CreateLessonDto, teacherId: number) {
    //     const existingTeacher = await this.prisma.teacher.findUnique({
    //         where: { id: teacherId }
    //     })

    //     if (!existingTeacher) throw new HttpException("Teacher not found", HttpStatus.NOT_FOUND)

    //     const existingClassroom = await this.prisma.classroom.findUnique({
    //         where: { 
    //             id: createLessonDto.classroomId,
    //             teacherId 
    //         }
    //     })

    //     if (!existingClassroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

    //     if (!(createLessonDto.startAt.getTime() < createLessonDto.endAt.getTime())){
    //         throw new HttpException("Date Invalid", HttpStatus.BAD_REQUEST)
    //     }

    //     const lesson = await this.prisma.lesson.create({
    //         data: {
    //             startAt: createLessonDto.startAt,
    //             endAt: createLessonDto.endAt,
    //             classroomId: existingClassroom.id
    //         },
    //         include: {
    //             classroom: {
    //                 select: { 
    //                     name: true, 
    //                     teacher: {
    //                         select: {
    //                             id: true,
    //                             name: true,
    //                         }
    //                     }
    //                 }
    //             },
    //         }
    //     })

    //     return lesson;
    // }

    // async findOne(id: number) {
    //     const lesson = await this.prisma.lesson.findFirst({
    //         where: { id }
    //     })

    //     if (!lesson) throw new HttpException("Lesson not found", HttpStatus.NOT_FOUND)

    //     return lesson
    // }

    // async updateById(id: number, updateLessonDto: UpdateLessonDto){
    //     const existingLesson = await this.findOne(id)

    //     if(!existingLesson) throw new HttpException("Lesson not found", HttpStatus.NOT_FOUND)

    //     const startAt: Date = updateLessonDto.startAt ?? existingLesson.startAt
    //     const endAt: Date = updateLessonDto.endAt ?? existingLesson.endAt

    //     if (endAt.getTime() <= startAt.getTime()) throw new HttpException('endAt must be after startAt',HttpStatus.BAD_REQUEST);

    //     const data: { startAt?: Date, endAt?: Date } = {}
    //     if (updateLessonDto.startAt) data.startAt = startAt;
    //     if (updateLessonDto.endAt) data.endAt = endAt;        

    //     const updateLesson = await this.prisma.lesson.update({
    //         where: { id: existingLesson.id },
    //         data,
    //         select: {
    //             id: true,
    //             startAt: true,
    //             endAt: true
    //         }
    //     })

    //     return updateLesson;
    // }

    // async deleteById(id: number) {
    //     const existingLesson = await this.findOne(id)

    //     if (!existingLesson) throw new HttpException("Lesson not found", HttpStatus.NOT_FOUND)

    //     await this.prisma.lesson.delete({
    //         where: { id }
    //     })

    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: "Lesson deleted"
    //     }
    // }
}