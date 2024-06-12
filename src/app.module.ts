import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration, envValidationSchema } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [envConfiguration],
			validationSchema: envValidationSchema,
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: +process.env.POSTGRES_PORT,
			database: process.env.POSTGRES_DB,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			synchronize: process.env.POSTGRES_SYNC === 'true',
			autoLoadEntities: true,
		}),
		ProductsModule,
		CommonModule,
		SeedModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
