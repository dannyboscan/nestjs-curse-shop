import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callBack: (error: Error | null, acceptFile: boolean) => void,
) => {
	if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
		return callBack(
			new BadRequestException('Only image files are allowed!'),
			false,
		);
	}

	return callBack(null, true);
};
