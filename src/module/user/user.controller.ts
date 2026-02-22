import { Controller, UseGuards } from "@nestjs/common";
import { RoleGuard } from "src/common/guards/role.guard";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { TeacherService } from "../teacher/teacher.service";

@UseGuards(AuthTokenGuard, RoleGuard)
@Controller('/me')
export class UserController {
    constructor(
        //  private readonly teacherService: TeacherService
    ){ }
}