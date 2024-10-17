import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('bootstrap');

	app.enableCors();
	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);

	const config = new DocumentBuilder()
		.setTitle('NestJS Teslo App Curse')
		.setDescription('Curso de NestJs')
		.setVersion('0.1.0')
		.addTag('nestjs')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT);
	logger.debug(`App running on port: ${process.env.PORT}`);
}
bootstrap();
