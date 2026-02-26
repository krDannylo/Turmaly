import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post-dto";
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { UserRole } from "@prisma/client";
import { ParamsResponse } from "../llm/types/params.types";
import { buildPostWhere } from "../llm/mapper/post-query.mapper";

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(classroomId: number, createPostDto: CreatePostDto, profile: UserProfileDto){
        const existingClassroom = await this.prisma.classroom.findUnique({
            where: { 
                id: classroomId,
                teacherId: profile.profileId 
            }
        })

        if (!existingClassroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

        const post = await this.prisma.post.create({
            data: {
                title: createPostDto.title,
                isPinned: createPostDto.isPinned ?? false,
                classroomId: existingClassroom.id,
                teacherId: profile.profileId ,

                ...(createPostDto.content && {
                    content: createPostDto.content,
                }),
            },
            include: {
                classroom: {
                    select: { 
                        name: true, 
                        teacher: {
                            select: { 
                                user: {
                                    select: {
                                        id: true,  
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                
            }
        })
        
        return post;
    }

    async findAllPostByClassroomId(classroomId: number, profile: UserProfileDto) {
        let posts;
        if(profile.role === UserRole.TEACHER) {
            posts = await this.prisma.post.findMany({
                where: {
                    classroomId,
                    classroom: {
                        teacherId: profile.profileId
                    }
                }
            })
        } else if (profile.role === UserRole.STUDENT) {
            posts = await this.prisma.post.findMany({
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
            })
        }

        if (!posts.length) {
            throw new HttpException("Posts not found", HttpStatus.NOT_FOUND)
        }

        return posts;
    }
    async findOne(id: number, profile: UserProfileDto) {
        let post;
        if(profile.role === UserRole.TEACHER) {
            post = await this.prisma.post.findFirst({
                where: { 
                    id,
                    classroom: {
                        teacherId: profile.profileId
                    }
                }
            })
        } else if (profile.role === UserRole.STUDENT) {
            post = await this.prisma.post.findFirst({
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

        if (!post) throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

        return post
    }

    async findByParams(params: ParamsResponse){
        const where = buildPostWhere(params)
        return this.prisma.post.findMany({ where })
    }

    async findManyByPostId(postIds: []){
        return await this.prisma.post.findMany({
            where: {
                id: {
                    in: postIds
                }
            }
        })
    }

    async updateById(id: number, updatePostDto: UpdatePostDto, profile: UserProfileDto){
        const existingPost = await this.findOne(id, profile)

        if(!existingPost) throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

        const updateData: {
            title?: string
            content?: string | null
            isPinned?: boolean
        } = {
            title: updatePostDto.title ?? existingPost.title,
            isPinned: updatePostDto.isPinned ?? existingPost.isPinned,
            content: updatePostDto.content ?? existingPost.content,
        }

        const updatedPost = await this.prisma.post.update({
            where: { id: existingPost.id },
            data: updateData,
            select: {
                id: true,
                title: true,
                content: true,
                isPinned: true,
            }
        })

        return updatedPost;
    }

    async deleteById(id: number, profile: UserProfileDto) {
        const existingPost = await this.findOne(id, profile)

        if (!existingPost) throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

        await this.prisma.post.delete({
            where: { id }
        })

        return {
            statusCode: HttpStatus.OK,
            message: "Post deleted"
        }
    }
}