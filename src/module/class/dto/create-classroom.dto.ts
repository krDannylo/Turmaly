import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ClassroomType } from '@prisma/client'
import { ApiProperty } from "@nestjs/swagger"

export class CreateClassroomDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string

    @ApiProperty({ enum: ClassroomType })
    @IsEnum(ClassroomType)
    readonly type: ClassroomType
}