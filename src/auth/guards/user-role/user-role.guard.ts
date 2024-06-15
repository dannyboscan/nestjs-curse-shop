import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const validRoles: string[] = this.reflector.get(
			META_ROLES,
			context.getHandler(),
		);

		if (!validRoles || validRoles?.length === 0) return true;

		const req = context.switchToHttp().getRequest();
		const user = req.user as User;

		for (const rol of user.roles) {
			if (validRoles.includes(rol)) return true;
		}

		throw new UnauthorizedException(
			`User ${user.fullName} need a valid role: [${validRoles.join(', ')}]`,
		);

		return false;
	}
}
