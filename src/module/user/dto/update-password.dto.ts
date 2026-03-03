import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class UpdatePasswordDto {

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    readonly password: string

}