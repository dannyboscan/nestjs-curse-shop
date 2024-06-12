import slugify from 'slugify';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

export const GENDERS = ['men', 'women', 'kid', 'unisex'];

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', { unique: true })
	title: string;

	@Column('text', { nullable: true })
	description: string;

	@Column('money', { default: 0 })
	price: number;

	@Column('text', { unique: true })
	slug: string;

	@Column('int', { default: 0 })
	stock: number;

	@Column('text', { array: true })
	sizes: string[];

	@Column('enum', { enum: ['men', 'women', 'kid', 'unisex'] })
	gender: string;

	@Column('text', { array: true, default: [] })
	tags?: string[];

	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	images?: ProductImage[];

	checkSlug(text: string): string {
		return slugify(text, {
			lower: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}

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
