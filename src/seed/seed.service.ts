import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/services/products.service';
import { productSeedData } from './data/products.seed';

@Injectable()
export class SeedService {
	constructor(private readonly productService: ProductsService) {}

	async seedData() {
		return await this.productService.bulkCreateProducts(productSeedData.products);
	}
}
