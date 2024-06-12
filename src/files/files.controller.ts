import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter: fileFilter,
			limits: { fileSize: 1048576 },
			storage: diskStorage({
				destination: './static/products',
				filename: fileNamer,
			}),
		}),
	)
	uploadProductFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) throw new BadRequestException('the file is required');

		return { file: file.originalname };
	}
}
