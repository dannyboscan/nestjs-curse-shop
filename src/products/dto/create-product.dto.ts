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

export class CreateProductDto {
	@IsString()
	@MinLength(1)
	title: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@IsNumber()
	@IsPositive()
	@IsOptional()
	stock?: number;

	@IsArray()
	@IsString({ each: true })
	sizes: string[];

	@IsIn(GENDERS)
	gender: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags?: string[];

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[];
}
