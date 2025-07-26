import { IsOptional, IsInt, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @Min(0)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @Min(1)
    limit?: number;
}