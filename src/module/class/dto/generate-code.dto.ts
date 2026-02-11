import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString,MaxLength, MinLength } from "class-validator"
import { Type } from "class-transformer"
import { AccessCodeConfig } from "src/common/config/access-code.config"

export class GenerateCodeDto {

    @MinLength(AccessCodeConfig.MIN_LENGTH)
    @MaxLength(AccessCodeConfig.MAX_LENGTH)
    @IsString()
    @IsOptional()
    readonly code: string

    @IsNotEmpty()
    @IsBoolean()
    readonly unique: boolean

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    readonly expiresAt: Date

}