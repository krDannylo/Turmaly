import { Type } from "class-transformer"
import { IsOptional, IsPositive, Max, Min } from "class-validator"

export class PaginationQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    readonly page?: number = 1

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(50)
    readonly limit?: number = 10
}

export class PaginationResponseDto<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }
}