import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateClassroomDto } from "./dto/create-classroom.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { RoleGuard } from "src/common/guards/role.guard";
import { Role } from "src/common/enums/role.enums";
import { Roles } from "src/common/decorators/roles.decorator";
import { ClassroomService } from "./classroom.service";
import { GetTeacherId } from "src/common/decorators/get-teacher-id.decorator";
import { ResponseClassroomDto } from "./dto/response-classroom.dto";
import { UpdateClassroomDto } from "./dto/update-classroom.dto";

@UseGuards(AuthTokenGuard, RoleGuard)
@Controller('/class')
export class ClassroomController {

    constructor(
        private readonly classroomService: ClassroomService,
    ){ }

    @Roles(Role.TEACHER)
    @Post()
    createClass(
        @Body() createClassroomDto: CreateClassroomDto,
        @GetTeacherId() teacherId
    ): Promise<ResponseClassroomDto>{
        return this.classroomService.create(createClassroomDto, teacherId)
    }

    @Roles(Role.TEACHER)
    @Get()
    findAllClass(@GetTeacherId() teacherId){
        return this.classroomService.findAll(teacherId)
    }

    @Roles(Role.TEACHER)
    @Patch(':id')
    updateClassroom(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClassroomDto: UpdateClassroomDto
    ): Promise<ResponseClassroomDto>{
        return this.classroomService.updateById(id, updateClassroomDto)
    }
}