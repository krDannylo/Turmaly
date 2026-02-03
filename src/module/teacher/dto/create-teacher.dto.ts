import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTeacherDto {

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    // @Transform()
    readonly name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    // @Transform()
    readonly email: string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    // @Transform()
    readonly password: string

}