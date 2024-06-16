import slugify from 'slugify';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export const GENDERS = ['men', 'women', 'kid', 'unisex'];

@Entity({ name: 'products' })
export class Product {
	@PrimaryGeneratedColumn('uuid')
	@ApiProperty({
		example: '311d3e78-4cd8-4441-a100-34131561f0e5',
		uniqueItems: true,
		description: 'Unique identifier for product item',
	})
	id: string;

	@Column('text', { unique: true })
	@ApiProperty({
		example: 'Nike Air Max Dn',
		uniqueItems: true,
		description: 'Name of the product',
	})
	title: string;

	@Column('text', { nullable: true })
	@ApiProperty()
	description: string;

	@Column('money', { default: 0 })
	@ApiProperty()
	price: number;

	@Column('text', { unique: true })
	@ApiProperty()
	slug: string;

	@Column('int', { default: 0 })
	@ApiProperty()
	stock: number;

	@Column('text', { array: true })
	@ApiProperty()
	sizes: string[];

	@Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
	@ApiProperty()
	gender: string;

	@Column('text', { array: true, default: [] })
	@ApiProperty()
	tags?: string[];

	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	@ApiProperty()
	images?: ProductImage[];

	checkSlug(text: string): string {
		return slugify(text, {
			lower: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}

	@ManyToOne(() => User, (user) => user.id, {
		eager: true,
		nullable: true,
		onDelete: 'SET NULL',
	})
	@ApiProperty()
	createdBy: User;

	@BeforeInsert()
	beforeInsert() {
		if (!this.slug) this.slug = this.checkSlug(this.title);
		else this.slug = this.checkSlug(this.slug);
	}

	@BeforeUpdate()
	beforeUpdate() {
		if (this.checkSlug(this.title) !== this.slug)
			this.slug = this.checkSlug(this.title);
	}
}
