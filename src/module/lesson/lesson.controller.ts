import { GetTeacherId } from './../../common/decorators/get-teacher-id.decorator';
import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { ResponseLessonDto } from './dto/response-lesson.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enums';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { MessageResponseDto } from 'src/common/dto/message-responde.dto';

@UseGuards(AuthTokenGuard, RoleGuard)
@Roles(Role.TEACHER)
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ){ }

    @Post()
    createLesson(
        @Body() createLessonDto: CreateLessonDto,
        @GetTeacherId() teacherId
    ): Promise<ResponseLessonDto>{
        return this.lessonService.create(createLessonDto, teacherId)
    }

    @Patch(':id')
    updateLesson(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLessonDto: UpdateLessonDto
    ): Promise<ResponseLessonDto>{
        return this.lessonService.updateById(id, updateLessonDto) 
    }

    @Delete(':id')
    deleteById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<MessageResponseDto> {
        return this.lessonService.deleteById(id)
    }
}