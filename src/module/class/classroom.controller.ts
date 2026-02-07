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

@UseGuards(AuthTokenGuard, RoleGuard)
@Roles(Role.TEACHER)
@Controller('/class')
export class ClassroomController {

    constructor(
        private readonly classroomService: ClassroomService,
    ){ }

    @Post()
    createClassroom(
        @Body() createClassroomDto: CreateClassroomDto,
        @GetTeacherId() teacherId
    ): Promise<ResponseClassroomDto>{
        return this.classroomService.create(createClassroomDto, teacherId)
    }

    @Get()
    findClassrooms(
        @GetTeacherId() teacherId,
        @Query() paginationQueryDto: PaginationQueryDto
    ): Promise<PaginationResponseDto<ResponseClassroomDto>>{
        return this.classroomService.findAllPaginated(teacherId, paginationQueryDto)
    }

    @Patch(':id')
    updateClassroom(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClassroomDto: UpdateClassroomDto
    ): Promise<ResponseClassroomDto>{
        return this.classroomService.updateById(id, updateClassroomDto)
    }

    @Delete(':id')
    deleteById(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto>{
        return this.classroomService.deleteById(id)
    }
}