import { forwardRef, Module } from '@nestjs/common';
import { CatsController } from './controller/cats.controller';
import { CatsService } from './service/cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatsSchema } from './cats.schema';
import { CatsRepository } from './cats.repository';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { Comments, CommentsSchema } from '../comments/comments.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatsSchema },
      { name: Comments.name, schema: CommentsSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
