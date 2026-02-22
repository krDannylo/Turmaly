import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";
import { UserProfileDto } from "../user/dto/user-profile.dto";

@Injectable()
export class StudentService {
    constructor(
        private prisma: PrismaService
    ){ }

    async findOne(studentId: number, profile: UserProfileDto, classroomId?: number) {
        let student;
        if(profile.role === UserRole.TEACHER){
            student = await this.prisma.student.findFirst({
                where: { 
                    id: studentId,
                    classroomStudents: {
                        some: {
                            classroom: {
                                teacherId: profile.profileId
                            }
                        }
                    }
                }
            })
        } else if(profile.role === UserRole.STUDENT){
            student = await this.prisma.student.findFirst({
                where: { 
                    id: studentId,
                    classroomStudents: {
                        some: {
                            classroom: {
                                classroomStudents: {
                                    some: {
                                        studentId: profile.profileId
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }

        if (!student) throw new HttpException("Student not found", HttpStatus.NOT_FOUND)

        return student
    }

    async findAll(profile: UserProfileDto) {
        return await this.prisma.student.findMany({
            where: {
                classroomStudents: {
                    some: {
                        classroom: {
                            teacherId: profile.profileId
                        }
                    }
                }
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }, 
                classroomStudents: {
                    select: {
                        classroom: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })
    }
}