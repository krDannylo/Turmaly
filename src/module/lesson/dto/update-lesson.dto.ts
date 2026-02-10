import { Type } from "class-transformer"
import { IsDate, IsOptional } from "class-validator"

export class UpdateLessonDto {

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly startAt: Date

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly endAt: Date
}