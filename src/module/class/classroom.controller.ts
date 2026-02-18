import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { RoleGuard } from "src/common/guards/role.guard";
import { Role } from "src/common/enums/role.enums";
import { Roles } from "src/common/decorators/roles.decorator";
import { ClassroomService } from "./classroom.service";
import { GetTeacherId } from "src/common/decorators/get-teacher-id.decorator";
import { ResponseClassroomDto } from "./dto/response-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";
import { PaginationQueryDto, PaginationResponseDto } from "src/common/dto/pagination.dto";
import { MessageResponseDto } from "src/common/dto/message-responde.dto";
import { GenerateCodeDto } from "./dto/generate-code.dto";
import { GetStudentId } from "src/common/decorators/get-student-id.decorator";

@UseGuards(AuthTokenGuard, RoleGuard)
@Controller('/classroom')
export class ClassroomController {

    constructor(
        private readonly classroomService: ClassroomService,
    ){ }

    // @Post()
    // @Roles(Role.TEACHER)
    // createClassroom(
    //     @Body() createClassroomDto: CreateClassroomDto,
    //     @GetTeacherId() teacherId
    // ): Promise<ResponseClassroomDto>{
    //     return this.classroomService.create(createClassroomDto, teacherId)
    // }

    // @Get()
    // @Roles(Role.TEACHER)
    // findClassrooms(
    //     @GetTeacherId() teacherId,
    //     @Query() paginationQueryDto: PaginationQueryDto
    // ): Promise<PaginationResponseDto<ResponseClassroomDto>>{
    //     return this.classroomService.findAllPaginated(teacherId, paginationQueryDto)
    // }

    // @Patch(':id')
    // @Roles(Role.TEACHER)
    // updateClassroom(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() updateClassroomDto: UpdateClassroomDto
    // ): Promise<ResponseClassroomDto>{
    //     return this.classroomService.updateById(id, updateClassroomDto)
    // }

    // @Delete(':id')
    // @Roles(Role.TEACHER)
    // deleteById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto>{
    //     return this.classroomService.deleteById(id)
    // }

    // @Post(':id/generateCode')
    // @Roles(Role.TEACHER)
    // generateCode(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() generateCodeDto: GenerateCodeDto
    // ){
    //     return this.classroomService.generateEnrollmentCode(id, generateCodeDto)
    // }

    // @Post('inviteCode/:code')
    // @Roles(Role.STUDENT)
    // inviteCode(
    //     @Param('code') inviteCode: string,
    //     @GetStudentId() studentId
    // ){
    //     return this.classroomService.accessCode(inviteCode, studentId)
    // }
}