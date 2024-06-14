import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerHelper = {
  storage: diskStorage({
    destination: './uploads', // Choose your preferred storage path
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  }),
};
