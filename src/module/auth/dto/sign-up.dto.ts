import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../common/user-type.enum";

export class SignUpDto {

    @IsNotEmpty()
    readonly role: UserRole

    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsOptional()
    readonly phone: string

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    // @Transform()
    readonly password: string
}