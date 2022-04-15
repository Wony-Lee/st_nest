import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // app 안에서는 useStaticAssets 가 없기때문에 에러가 뜰텐데.
  // 이 때 맨 위에 app 선언을 한 곳에서 제네릭으로 express 라는 것을 명시해주어야한다.
  // 첫번째 인자 http://localhost:8000/media/cats/app.png
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
  });
  const config = new DocumentBuilder()
    .setTitle('C.I.C')
    .setDescription('cat')
    .setVersion('1.0.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const PORT = process.env.PORT;
  app.enableCors({
    origin: true, // 개발일 경우에는 true여도 되지만 배포 후에는 특정 url을 써주면된다.
    // origin: https:// ~~
    credentials: true,
  });
  await app.listen(PORT);
}
bootstrap();
