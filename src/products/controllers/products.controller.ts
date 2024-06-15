import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Auth, GetRequestUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
@Auth(ValidRoles.user)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	create(
		@Body() createProductDto: CreateProductDto,
		@GetRequestUser() user: User,
	) {
		return this.productsService.create(createProductDto, user);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id);
	}
}
