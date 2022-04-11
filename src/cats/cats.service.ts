import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatRequestDto } from './dto/dto.request.dto';
import { Cat } from './cats.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catModel.exists({ email });

    // 이메일이 존재한다면 Exception 발생시킴.
    if (isCatExist) {
      throw new HttpException('해당 고양이는 이미 존재합니다.', 403);
    }

    // npm i bcrypt
    // npm i -D @types/bcrypt
    // password에 대해서 hash암호화를 진행함.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 모델에 대한 생성
    const cat = await this.catModel.create({
      email,
      name,
      password: hashedPassword,
    });

    // 해당 모델을 return
    return cat.readOnlyData;
  }
}
