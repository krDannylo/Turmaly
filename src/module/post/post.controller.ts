import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { GetTeacherId } from "src/common/decorators/get-teacher-id.decorator";
import { ResponsePostDto } from "./dto/response-post.dto";
import { PostService } from "./post.service";
import { UpdatePostDto } from "./dto/update-post-dto";
import { MessageResponseDto } from "src/common/dto/message-responde.dto";

@UseGuards(AuthTokenGuard)
@Controller('/post')
export class PostController {
    
    constructor(
        private readonly postService: PostService
    ){ }

    @Post()
    createPost(
        @Body() createPostDto: CreatePostDto,
        @GetTeacherId() teacherId        
    ): Promise<ResponsePostDto> {
        return this.postService.create(createPostDto, teacherId)
    }

    @Patch(':id')
    updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto
    ): Promise<ResponsePostDto> {
        return this.postService.updateById(id, updatePostDto)
    }

    @Delete(':id')
    deleteById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto>{
        return this.postService.deleteById(id)
    }
}