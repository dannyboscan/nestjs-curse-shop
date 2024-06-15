import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
	private readonly logger = new Logger('AuthService');

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async create(createUserDto: CreateUserDto) {
		try {
			createUserDto.password = bcrypt.hashSync(
				createUserDto.password,
				10,
			);
			const user = this.userRepository.create(createUserDto);
			await this.userRepository.save(user);

			return { ...user, accessToken: this.getJwt({ id: user.id }) };
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto;

		const user = await this.userRepository.findOne({
			where: { email: email.toLowerCase().trim() },
			select: { id: true, email: true, password: true },
		});

		if (!user)
			throw new NotFoundException(
				`User with email '${loginUserDto.email} not exists or incorrect password'`,
			);

		const isValidPassword = bcrypt.compareSync(password, user.password);
		if (!isValidPassword)
			throw new UnauthorizedException(
				`User with email '${loginUserDto.email} not exists or incorrect password'`,
			);

		delete user.password;

		return { ...user, accessToken: this.getJwt({ id: user.id }) };
	}

	private getJwt(payload: JwtPayload): string {
		const token = this.jwtService.sign(payload);
		return token;
	}

	async getUser(id: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });

		return user;
	}

	private handleDBExceptions(error: any): void {
		if (typeof error === 'object' && error.hasOwnProperty('table'))
			throw new BadRequestException(`${error.message}: ${error.detail}`);

		this.logger.error(`${error.message}: ${error.detail}`);
		console.error(error);
	}
}
