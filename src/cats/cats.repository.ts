import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './cats.schema';
import { Model, Types } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    cat.imgUrl = `http://localhost:8000/media/${fileName}`;
    const newCat = await cat.save();
    console.log(newCat);

    return newCat.readOnlyData;
  }

  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    // select 를 사용하지 않으면 전체를 갖고오는 것이고, 가져올 필요 옶는 것은 - 를 붙여서 작성해주면 된다.
    // 그냥 email 과 name만 갖고오고싶다면 .select('email name') 을 써주면 된다.
    // password 를 갖고올 필요가 없으니 -password를 입력해주면된다.
    const cat = await this.catModel.findById(catId).select('-password');
    return cat;
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }
  // 이 부분 나중에 찾아서 수정해야함
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email });
    // @ts-ignore
    return result;
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}
