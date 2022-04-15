import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatRequestDto } from '../dto/cats.request.dto';
import { Cat } from '../cats.schema';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../cats.repository';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existsByEmail(email);
    console.log('isCatExist', isCatExist);
    // 이메일이 존재한다면 Exception 발생시킴.
    if (isCatExist) {
      throw new HttpException('해당 고양이는 이미 존재합니다.', 403);
    }

    // npm i bcrypt
    // npm i -D @types/bcrypt
    // password에 대해서 hash암호화를 진행함.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 모델에 대한 생성
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    // 해당 모델을 return
    return cat.readOnlyData;
  }
}
