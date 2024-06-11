import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	POSTGRES_USER: Joi.string().required(),
	POSTGRES_PASSWORD: Joi.string().required(),
	POSTGRES_DB: Joi.string().required(),
	POSTGRES_HOST: Joi.string().default('localhost'),
	POSTGRES_PORT: Joi.number().default(5432),
	POSTGRES_SYNC: Joi.boolean().default(false),
	PORT: Joi.number().default(9000),
});

export const envConfiguration = () => ({
	database: {
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		host: process.env.POSTGRES_HOST,
		dbname: process.env.POSTGRES_DB,
		port: process.env.POSTGRES_PORT,
		sync: process.env.POSTGRES_SYNC,
	},
	port: process.env.PORT,
});
