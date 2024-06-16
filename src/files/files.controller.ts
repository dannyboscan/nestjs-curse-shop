import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
	Get,
	Param,
	Res,
	Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
@Auth(ValidRoles.user)
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
	@ApiConsumes('multipart/form-data')
	uploadProductFile(
		@UploadedFile() file: Express.Multer.File,
		@Req() req: Request,
	) {
		if (!file) throw new BadRequestException('the file is required');

		const baseUrl = `${req.protocol}://${req.get('Host')}${req.baseUrl}`;
		return { secureUrl: `${baseUrl}/api/files/product/${file.filename}` };
	}

	@Get('product/:imageName')
	findProductImage(
		@Param('imageName') imageName: string,
		@Res() res: Response,
	) {
		const imagePath: string = this.filesService.getProductImage(imageName);
		res.sendFile(imagePath);
	}
}
