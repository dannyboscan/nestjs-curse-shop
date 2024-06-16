import {
	IsArray,
	IsIn,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';
import { GENDERS } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@IsString()
	@MinLength(1)
	@ApiProperty()
	title: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	description?: string;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	@ApiProperty()
	price?: number;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	@ApiProperty()
	stock?: number;

	@IsArray()
	@IsString({ each: true })
	@ApiProperty()
	sizes: string[];

	@IsIn(GENDERS)
	@ApiProperty()
	gender: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@ApiProperty()
	tags?: string[];

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@ApiProperty()
	images?: string[];
}
