import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { ResponseLessonDto } from './dto/response-lesson.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { MessageResponseDto } from 'src/common/dto/message-responde.dto';
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { GetUserProfile } from "src/common/decorators/get-profile-id.decorator";
import { ProfileGuard } from "src/common/guards/profile.guard";
import { Role } from "src/common/enums/role.enums";

@UseGuards(AuthTokenGuard, RoleGuard, ProfileGuard)
@Controller('lessons')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ){ }

    @Get(':lessonsId')
    getById(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @GetUserProfile() profile: UserProfileDto
    ) {
        return this.lessonService.findOne(lessonId, profile)
    }

    @Patch(':lessonsId')
    @Roles(Role.TEACHER)
    updateLesson(
        @Param('lessonsId', ParseIntPipe) id: number,
        @Body() updateLessonDto: UpdateLessonDto,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<ResponseLessonDto>{
        return this.lessonService.updateById(id, updateLessonDto, profile) 
    }

    @Delete(':lessonsId')
    @Roles(Role.TEACHER)
    deleteById(
        @Param('lessonsId', ParseIntPipe) id: number,
        @GetUserProfile() profile: UserProfileDto
    ): Promise<MessageResponseDto> {
        return this.lessonService.deleteById(id, profile)
    }
}