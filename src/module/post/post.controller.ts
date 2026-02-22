import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { ResponsePostDto } from "./dto/response-post.dto";
import { PostService } from "./post.service";
import { UpdatePostDto } from "./dto/update-post-dto";
import { MessageResponseDto } from "src/common/dto/message-responde.dto";
import { GetUserProfile } from "src/common/decorators/get-profile-id.decorator";
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { RoleGuard } from "src/common/guards/role.guard";
import { ProfileGuard } from "src/common/guards/profile.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enums";

@UseGuards(AuthTokenGuard, RoleGuard, ProfileGuard)
@Controller('/post')
export class PostController {
    
    constructor(
        private readonly postService: PostService
    ){ }

    @Get(':postId')
    getById(
        @Param('postId', ParseIntPipe) lessonId: number,
        @GetUserProfile() profile: UserProfileDto
    ) {
        return this.postService.findOne(lessonId, profile)
    }

    @Patch(':postId')
    @Roles(Role.TEACHER)
    updatePost(
        @Param('postId', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<ResponsePostDto> {
        return this.postService.updateById(id, updatePostDto, profile)
    }

    @Delete(':id')
    @Roles(Role.TEACHER)
    deleteById(
        @Param('id', ParseIntPipe) id: number,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<MessageResponseDto>{
        return this.postService.deleteById(id, profile)
    }
}