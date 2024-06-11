import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
	@IsInt()
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	limit?: number;

	@IsInt()
	@IsOptional()
	@Min(0)
	@Type(() => Number)
	offset?: number;
}
