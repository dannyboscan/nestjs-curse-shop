import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_images' })
export class ProductImage {
	@PrimaryGeneratedColumn()
	@ApiProperty()
	id: number;

	@Column('text')
	@ApiProperty()
	url: string;

	@ManyToOne(() => Product, (product) => product.images, {
		onDelete: 'CASCADE',
	})
	product: Product;
}
