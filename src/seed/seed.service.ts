import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/services/products.service';
import { productSeedData } from './data/products.seed';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
	constructor(
		private readonly productService: ProductsService,
		private readonly authService: AuthService,
	) {}

	async seedData() {
		await this.deleteTables();
		const users = await this.authService.bulkCreate(productSeedData.users);
		const adminUser = users[0];
		await this.productService.bulkCreate(
			productSeedData.products.map((product) => ({
				...product,
				createdBy: adminUser,
			})),
		);

		return { ok: true, message: 'Seed Executed' };
	}

	private async deleteTables() {
		await this.productService.removeAll();
		await this.authService.removeAll();
	}
}
