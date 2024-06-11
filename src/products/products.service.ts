import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
	) {}

	async create(createProductDto: CreateProductDto) {
		try {
			const product = this.productRepository.create(createProductDto);
			await this.productRepository.save(product);
			return product;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 20, offset = 0 } = paginationDto;
		try {
			const products = await this.productRepository.find({
				take: limit,
				skip: offset,
				// TODO: relaciones
			});
			return products;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async findOne(id: string) {
		let query = {};
		if (isUUID(id)) query = { id };
		else query = { slug: id };

		let product: Product;

		try {
			if (isUUID(id))
				product = await this.productRepository.findOneBy(query);
			else {
				const query = this.productRepository.createQueryBuilder();
				product = await query
					.where('slug=:slug or UPPER(title)=:title', {
						slug: id.toLocaleLowerCase(),
						title: id.toLocaleUpperCase(),
					})
					.getOne();
			}
		} catch (error) {
			this.handleDBExceptions(error);
		}

		if (!product)
			throw new NotFoundException(
				`Product not found with key: ${JSON.stringify(query)}'`,
			);

		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		let product: Product;
		try {
			product = await this.productRepository.preload({
				id,
				...updateProductDto,
			});

			if (product) await this.productRepository.save(product);
		} catch (error) {
			this.handleDBExceptions(error);
		}

		if (!product)
			throw new NotFoundException(
				`Product not found with key: ${JSON.stringify({ id })}'`,
			);

		return product;
	}

	async remove(id: string) {
		const product = await this.findOne(id);
		try {
			await this.productRepository.remove(product);
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	private handleDBExceptions(error: any) {
		if (typeof error === 'object' && error.hasOwnProperty('table'))
			throw new BadRequestException(`${error.message}: ${error.detail}`);

		console.error(error);
		this.logger.error(`${error.message}: ${error.detail}`);
	}
}
