import { Body, Controller, Post } from "@nestjs/common";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { ResponseTeacherDto } from "./dto/response-teacher.dto";
import { TeacherService } from "./teacher.service";

@Controller('/teacher')
export class TeacherController {

    constructor(
        private readonly teacherService: TeacherService,
    ){ }

    @Post()
    createTeacher(@Body() createTeacherDto: CreateTeacherDto): Promise<ResponseTeacherDto>{
        return this.teacherService.create(createTeacherDto)
    }
}