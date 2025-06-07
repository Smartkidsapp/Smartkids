import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { TMP_DIR } from '../constants/dir.constants';
import { v4 as uuidv4 } from 'uuid';

export const defaultStorage = diskStorage({
  destination: join(TMP_DIR, 'smartkids'),
  filename: (req, file, cb) => {
    const randomName = uuidv4();
    return cb(null, `${randomName}${extname(file.originalname)}`);
  },
});
