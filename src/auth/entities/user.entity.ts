import { ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty()
	id: string;

	@Column('text', { unique: true, nullable: false })
	@ApiProperty()
	email: string;

	@Column('text', { select: false })
	@ApiProperty()
	password: string;

	@Column('text')
	@ApiProperty()
	fullName: string;

	@Column('bool', { default: true })
	@ApiProperty()
	isActive: boolean;

	@Column('bool', { default: false })
	@ApiProperty()
	isAdmin: boolean;

	@Column('text', { array: true, default: ['user'] })
	@ApiProperty()
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
