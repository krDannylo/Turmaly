import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post-dto";

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(createPostDto: CreatePostDto, teacherId: number){
        const existingTeacher = await this.prisma.teacher.findUnique({
            where: { id: teacherId }
        })

        if (!existingTeacher) throw new HttpException("Teacher not found", HttpStatus.NOT_FOUND)

        const existingClassroom = await this.prisma.classroom.findUnique({
            where: { 
                id: createPostDto.classroomId,
                teacherId 
            }
        })

        if (!existingClassroom) throw new HttpException("Classroom not found", HttpStatus.NOT_FOUND)

        const post = await this.prisma.post.create({
            data: {
                title: createPostDto.title,
                isPinned: createPostDto.isPinned ?? false,
                classroomId: existingClassroom.id,
                teacherId,

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
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                
            }
        })
        
        return post;
    }

    async findOne(id: number) {
        const post = await this.prisma.post.findFirst({
            where: { id }
        })

        if (!post) throw new HttpException("Post not found", HttpStatus.NOT_FOUND)

        return post
    }

   async updateById(id: number, updatePostDto: UpdatePostDto){
        const existingPost = await this.findOne(id)

        if(!existingPost) throw new HttpException("Lesson not found", HttpStatus.NOT_FOUND)

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

    async deleteById(id: number) {
        const existingPost = await this.findOne(id)

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