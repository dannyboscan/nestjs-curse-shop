import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		super({
			secretOrKey: configService.get('jwt_secret'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload;
		const user: User = await this.authService.getUser(id);

		if (!user) throw new UnauthorizedException('Invalid Token');
		if (!user.isActive) throw new UnauthorizedException('User is inactive');

		delete user.password;

		return user;
	}
}
