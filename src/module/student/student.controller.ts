import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { StudentService } from "./student.service";
import { GetUserProfile } from "src/common/decorators/get-profile-id.decorator";
import { UserProfileDto } from "../user/dto/user-profile.dto";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { RoleGuard } from "src/common/guards/role.guard";
import { ProfileGuard } from "src/common/guards/profile.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enums";

@UseGuards(AuthTokenGuard, RoleGuard, ProfileGuard)
@Controller('students')
export class StudentController {
    constructor(
        private readonly studentService: StudentService
    ){}

    @Get(':studentId')
    getById(
        @Param('studentId', ParseIntPipe) studentId: number,
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.studentService.findOne(studentId, profile)
    }

    @Get()
    @Roles(Role.TEACHER)
    getAllStundents(
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.studentService.findAll(profile)
    }
}