import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { RoleGuard } from "src/common/guards/role.guard";
import { Role } from "src/common/enums/role.enums";
import { Roles } from "src/common/decorators/roles.decorator";
import { ClassroomService } from "./classroom.service";
import { ResponseClassroomDto } from "./dto/response-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { PaginationQueryDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { MessageResponseDto } from "src/common/dto/message-responde.dto";
import { GenerateCodeDto } from "./dto/generate-code.dto";
import { GetUserProfile } from "src/common/decorators/get-profile-id.decorator";
import { ProfileGuard } from "src/common/guards/profile.guard";
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { CreateLessonDto } from "../lesson/dto/create-lesson.dto";
import { ResponseLessonDto } from "../lesson/dto/response-lesson.dto";
import { LessonService } from "../lesson/lesson.service";
import { CreatePostDto } from "../post/dto/create-post.dto";
import { PostService } from "../post/post.service";

@UseGuards(AuthTokenGuard, RoleGuard, ProfileGuard)
@Controller('/classroom')
export class ClassroomController {

    constructor(
        private readonly classroomService: ClassroomService,
        private readonly lessonService: LessonService,
        private readonly postService: PostService
    ){ }
    //!Classroom
    @Post()
    @Roles(Role.TEACHER)
    createClassroom(
        @Body() createClassroomDto: CreateClassroomDto,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.classroomService.create(createClassroomDto, profile)
    }

    @Get()
    getClassrooms(
        @Query() paginationQueryDto: PaginationQueryDto,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<PaginationResponseDto<ResponseClassroomDto>>{
        return this.classroomService.findAllPaginated(paginationQueryDto, profile)
    }

    @Get(':classroomId')
    getClassroom(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<PaginationResponseDto<ResponseClassroomDto>>{
        return this.classroomService.findOne(classroomId, profile)
    }

    @Patch(':classroomId')
    @Roles(Role.TEACHER)
    updateClassroom(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @Body() updateClassroomDto: UpdateClassroomDto,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<ResponseClassroomDto>{
        return this.classroomService.updateById(classroomId, updateClassroomDto, profile)
    }

    @Delete(':classroomId')
    @Roles(Role.TEACHER)
    deleteById(
        @Param('classroomId', ParseIntPipe) id: number,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<MessageResponseDto>{
        return this.classroomService.deleteById(id, profile)
    }

    @Post(':classroomId/generateEnrollmentCode')
    @Roles(Role.TEACHER)
    generateEnrollmentCode(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @Body() generateCodeDto: GenerateCodeDto,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.classroomService.generateEnrollmentCode(classroomId, generateCodeDto, profile)
    }

    @Post('inviteCode/:code')
    @Roles(Role.STUDENT)
    joinClassroomByCode(
        @Param('code') inviteCode: string,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.classroomService.enrollByCode(inviteCode, profile.profileId)
    }
    //!Lesson
    @Post(':classroomId/lessons')
    @Roles(Role.TEACHER)
    createLesson(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @Body() createLessonDto: CreateLessonDto,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<ResponseLessonDto>{
        console.log(profile)
        return this.lessonService.create(createLessonDto, profile , classroomId)
    }

    @Get(':classroomId/lessons')
    getLessonsByClassroomId(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.lessonService.findAllLessonByClassroomId(classroomId, profile)
    }
    //!Post
    @Post(':classroomId/post')
    @Roles(Role.TEACHER)
    createPost(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @Body() createPostDto: CreatePostDto,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.postService.create(classroomId, createPostDto, profile)
    }

    @Get(':classroomId/post')
    getPostsByClassroomId(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.postService.findAllPostByClassroomId(classroomId, profile)
    }
    //!Student
    @Get(':classroomId/students')
    getStudentsByClassroomId(
        @Param('classroomId', ParseIntPipe) classroomId: number,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.classroomService.findAllStudentByClassroomId(classroomId, profile)
    }
}