import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from '../service/cats.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import { PositiveIntPipe } from '../../pipes/positiveInt.pipe';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multer.options';
import { Cat } from '../cats.schema';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    // CurrentUser 에서 return request.user를 해주기때문에 cat 에 담기는 것은
    // request.user가 된다.
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'logOut';
  }

  @ApiOperation({ summary: '고양이 이미지 업로드' })
  // 여기서 fieldName 이 프론트와 같이 맞아야한다.
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat,
  ) {
    console.log(files);
    // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };

    // cat에 대한 정보를 가져오려면 Jwt에 저장된 내 정보를 갖고와야한다.
    return this.catsService.uploadImg(cat, files);
  }
}
