import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber } from "class-validator"
import { IsValidEndDate } from '../../../common/decorators/valid-date-to-lesson.decorator'

export class CreateLessonDto {

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly startAt: Date

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @IsValidEndDate('startAt', { message: 'endAt must be after startAt' })
    readonly endAt: Date

    @IsNotEmpty()
    @IsNumber()
    readonly classroomId: number
}