import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit?: number;

    getLimit(configService: ConfigService): number {
        return this.limit ?? configService.get<number>('defaultLimit') ?? 10;
    }

    getOffset(configService: ConfigService): number {
        return (this.page ?? 0) * this.getLimit(configService);
    }
}