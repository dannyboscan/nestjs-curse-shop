import { Product } from 'src/products/entities';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', { unique: true, nullable: false })
	email: string;

	@Column('text', { select: false })
	password: string;

	@Column('text')
	fullName: string;

	@Column('bool', { default: true })
	isActive: boolean;

	@Column('bool', { default: false })
	isAdmin: boolean;

	@Column('text', { array: true, default: ['user'] })
	roles: string[];

	@OneToMany(() => Product, (product) => product.createdBy)
	products: Product[];

	private emailToLowerCase() {
		this.email = this.email.toLowerCase().trim();
	}

	@BeforeInsert()
	beforeInsert() {
		this.emailToLowerCase();
	}

	@BeforeUpdate()
	beforeUpdate() {
		this.emailToLowerCase();
	}
}
