import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator"

export class UserDTO{

    @IsString()
    @IsOptional()
    readonly name: string

    @IsEmail()
    @IsOptional()
    readonly email: string

    @IsEmail()
    @IsOptional()
    readonly phone: string

    @IsString()
    @MinLength(5)
    @IsOptional()
    readonly password: string
}