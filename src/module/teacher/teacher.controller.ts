import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { ResponseTeacherDto } from "./dto/response-teacher.dto";
import { TeacherService } from "./teacher.service";
import { TokenPayloadParam } from "../auth/param/token-payload.params";
import { PayloadTokenDto } from "../auth/dto/payload-token.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";

@UseGuards(AuthTokenGuard)
@Controller('/teacher')
export class TeacherController {

    constructor(
        private readonly teacherService: TeacherService,
    ){ }

    @Post()
    createTeacher(@Body() createTeacherDto: CreateTeacherDto): Promise<ResponseTeacherDto>{
        return this.teacherService.create(createTeacherDto)
    }

    @Get('me')
    findLoggedTeacher(@TokenPayloadParam() tokenPayloadParam: PayloadTokenDto){
        return this.teacherService.findOne(tokenPayloadParam.sub)
    }
}