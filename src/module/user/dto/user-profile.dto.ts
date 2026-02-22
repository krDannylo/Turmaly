import { IsNotEmpty, IsNumber } from "class-validator"
import { UserRole } from "src/module/auth/common/user-type.enum"

export class UserProfileDto {

    @IsNumber()
    @IsNotEmpty()
    readonly userId: number

    @IsNotEmpty()
    readonly role: UserRole

    @IsNumber()
    @IsNotEmpty()
    readonly profileId: number

}