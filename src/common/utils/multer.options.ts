import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    console.log('create a root uploads folder');
    // 폴더를 만드는 명령어 -> path.join(__dirname < 현재 폴더를 의미,
    // '..' <- 부모 폴더에 uploads 폴더를 만들라는 의미다.
    fs.mkdirSync(path.join(__dirname, '..', 'uploads'));
  } catch (e) {
    console.error(e, 'the folder already exists...');
  }
  try {
    console.log(`Create a ${folder} uploads folder...`);
    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
  } catch (e) {
    console.error(`The ${folder} folder already exists...`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);
  return multer.diskStorage({
    destination(req, file, cb) {
      // 어디에 저장할 지
      const folderName = path.join(__dirname, '..', `uploads/${folder}`);
      cb(null, folderName);
    },
    filename(req, file, cb) {
      // 어떤 이름으로 올릴지
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      cb(null, fileName);
    },
  });
};

export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };
  return result;
};
