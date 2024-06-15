import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException,
} from '@nestjs/common';

export const GetRequestUser = createParamDecorator(
	(data, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		const { user } = req;

		if (!user)
			throw new InternalServerErrorException(
				'User not found in GetRequestUser',
			);

		if (data) return user[data];

		return user;
	},
);
