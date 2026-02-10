import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string

    @IsString()
    @IsOptional()
    readonly content: string

    @IsBoolean()
    @IsOptional()
    readonly isPinned: boolean 

    @IsNotEmpty()
    @IsNumber()
    readonly classroomId: number
}