import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { UserRole } from "../auth/common/user-type.enum";
import { ClassNotFoundException } from "../class/exceptions/class.exception";
import { LessonNotFoundException } from "./exception/lesson.exception";
import { InvalidDateException } from "src/common/exceptions/common.exception";
import { ResponseLessonDto } from "./dto/response-lesson.dto";

@Injectable()
export class LessonService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(createLessonDto: CreateLessonDto, profile: UserProfileDto, classroomId: number) {
        const existingClassroom = await this.prisma.classroom.findUnique({
            where: { 
                id: classroomId,
                teacherId: profile.profileId
            }
        })

        if (!existingClassroom) throw new ClassNotFoundException()

        if (!(createLessonDto.startAt.getTime() < createLessonDto.endAt.getTime())){
            throw new InvalidDateException()
        }

        const lesson = await this.prisma.lesson.create({
            data: {
                startAt: createLessonDto.startAt,
                endAt: createLessonDto.endAt,
                classroomId: existingClassroom.id
            },
            // include: {
            //     classroom: {
            //         select: { 
            //             name: true, 
            //             teacher: {
            //                 select: { 
            //                     user: {
            //                         select: { 
            //                             name: true,
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     },
            // }
        })

        return lesson;
    }

    async findOne(id: number, profile: UserProfileDto) {
        let lesson;
        if(profile.role === UserRole.TEACHER) {
            lesson = await this.prisma.lesson.findFirst({
                where: { 
                    id,
                    classroom: {
                        teacherId: profile.profileId
                    }
                }
            })
        } else if (profile.role === UserRole.STUDENT) {
            lesson = await this.prisma.lesson.findFirst({
                where: {
                    id,
                    classroom: {
                        classroomStudents: {
                            some: {
                                studentId: profile.profileId
                            }
                        }
                    }
                }
            })
        }

        if (!lesson) throw new LessonNotFoundException()

        return lesson
    }

    async findAllLessonByClassroomId(classroomId: number, profile: UserProfileDto): Promise<ResponseLessonDto[]> {
        let lessons: ResponseLessonDto[] = [];

        if(profile.role === UserRole.TEACHER) {
            lessons = await this.prisma.lesson.findMany({
                where: {
                    classroomId,
                    classroom: {
                        teacherId: profile.profileId
                    }
                }
            });
        } else if (profile.role === UserRole.STUDENT) {
            lessons = await this.prisma.lesson.findMany({
                where: {
                    classroomId,
                    classroom: {
                        classroomStudents: {
                            some: {
                                studentId: profile.profileId
                            }
                        }
                    }
                }
            });
        }

        return lessons;
    }

    async updateById(id: number, updateLessonDto: UpdateLessonDto, profile: UserProfileDto){
        const existingLesson = await this.findOne(id, profile)

        if(!existingLesson) throw new LessonNotFoundException()

        const startAt: Date = updateLessonDto.startAt ?? existingLesson.startAt
        const endAt: Date = updateLessonDto.endAt ?? existingLesson.endAt

        if (endAt.getTime() <= startAt.getTime()) throw new HttpException('endAt must be after startAt',HttpStatus.BAD_REQUEST);

        const data: { startAt?: Date, endAt?: Date } = {}
        if (updateLessonDto.startAt) data.startAt = startAt;
        if (updateLessonDto.endAt) data.endAt = endAt;

        const updateLesson = await this.prisma.lesson.update({
            where: { id: existingLesson.id },
            data,
            select: {
                id: true,
                startAt: true,
                endAt: true
            }
        })

        return updateLesson;
    }

    async deleteById(id: number, profile: UserProfileDto) {
        const existingLesson = await this.findOne(id, profile)

        if (!existingLesson) throw new LessonNotFoundException()

        await this.prisma.lesson.delete({
            where: { id }
        })

        return {
            statusCode: HttpStatus.OK,
            message: "Lesson deleted"
        }
    }
}