import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
	req: Express.Request,
	file: Express.Multer.File,
	callBack: (error: Error | null, acceptFile: string) => void,
) => {
	const ext = extname(file.originalname);
	callBack(null, `${uuid()}${ext}`);
};
