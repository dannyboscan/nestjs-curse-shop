import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { Auth, GetRequestUser } from './decorators';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@Auth(ValidRoles.admin, ValidRoles.superUser)
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	LoginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('status')
	@Auth(ValidRoles.user)
	checkAuthStatus(@GetRequestUser() user: User) {
		return this.authService.checkAuthStatus(user);
	}

	@Get('private')
	@Auth(ValidRoles.admin, ValidRoles.superUser)
	testAuth(@GetRequestUser() user: User, @RawHeaders() rawHeaders: string[]) {
		return { user, rawHeaders };
	}
}
