import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfiguration, envValidationSchema } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

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
		ServeStaticModule.forRoot({ rootPath: join(__dirname, '../public') }),
		ProductsModule,
		CommonModule,
		SeedModule,
		FilesModule,
		AuthModule,
		MessagesWsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
