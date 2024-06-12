import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product, ProductImage } from '../entities';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger('ProductsService');

	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>,

		private readonly dataSource: DataSource,
	) {}

	async create(createProductDto: CreateProductDto) {
		const { images = [], ...productFields } = createProductDto;

		try {
			const product = this.productRepository.create({
				...productFields,
				// * La relación del producto se crea automáticamente
				images: images.map((image) =>
					this.productImageRepository.create({ url: image }),
				),
			});
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
				relations: { images: true },
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
				const query = this.productRepository.createQueryBuilder('prod');
				product = await query
					.where('slug=:slug or UPPER(title)=:title', {
						slug: id.toLocaleLowerCase(),
						title: id.toLocaleUpperCase(),
					})
					.innerJoinAndSelect('prod.images', 'pimages')
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
		const { images = null, ...fieldsToUpdate } = updateProductDto;

		const product = await this.productRepository.preload({
			id,
			...fieldsToUpdate,
		});

		if (!product)
			throw new NotFoundException(
				`Product not found with key: ${JSON.stringify({ id })}'`,
			);

		// Create query runner
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (images) {
				await queryRunner.manager.delete(ProductImage, {
					product: { id },
				});

				product.images = images.map((image) =>
					this.productImageRepository.create({ url: image }),
				);
			}

			await queryRunner.manager.save(product);
			await queryRunner.commitTransaction();
			await queryRunner.release();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.handleDBExceptions(error);
		}

		return this.findOne(id);
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

	private async deleteAllProducts() {
		const query = this.productRepository.createQueryBuilder();
		try {
			await query.delete().where({}).execute();
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async bulkCreateProducts(createProductsDto: CreateProductDto[]) {
		await this.deleteAllProducts();

		try {
			const products = await this.productRepository.save(
				createProductsDto.map(({ images = [], ...productFields }) => {
					return {
						...productFields,
						images: images.map((image) =>
							this.productImageRepository.create({ url: image }),
						),
					};
				}),
			);

			return products;
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}
}
