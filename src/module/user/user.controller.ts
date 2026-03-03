import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { RoleGuard } from "src/common/guards/role.guard";
import { AuthTokenGuard } from "../auth/guard/auth-token.guard";
import { ProfileGuard } from "src/common/guards/profile.guard";
import { GetUserProfile } from "src/common/decorators/get-profile-id.decorator";
import { UserProfileDto } from "./dto/user-profile.dto";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@UseGuards(AuthTokenGuard, RoleGuard, ProfileGuard)
@Controller('/me')
export class UserController {
    constructor(
       private readonly userService: UserService
    ){ }

    @Get()
    getProfile(
        @GetUserProfile() profile: UserProfileDto
    ){
        return this.userService.getUserProfile(profile.userId)
    }

    @Patch()
    updateProfile(
        @GetUserProfile() profile: UserProfileDto,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.updateMe(profile, updateUserDto)
    }

    @Patch('/password')
    updatePassword(
        @GetUserProfile() profile: UserProfileDto,
        @Body() password: UpdatePasswordDto,
    ){
        return this.userService.updatePassword(profile, password)
    }
}