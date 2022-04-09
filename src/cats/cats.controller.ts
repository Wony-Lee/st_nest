import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../common/exceptions/http-exception.filter';
import { PositiveIntPipe } from '../pipes/positiveInt.pipe';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccessInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // localhost:8000/cats
  @Get()
  getAllCat() {
    console.log('Hello controller');
    return { cats: 'get all cat api' };
  }

  @Get(':id')
  // getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
  getOneCat(@Param('id', ParseIntPipe) param: number) {
    return 'one cat';
  }

  @Post()
  createCat() {
    return 'create Cat';
  }

  @Put(':id')
  updateCat() {
    return 'update Cat';
  }

  @Patch(':id')
  updatePartialCat() {
    return 'updatePartial Cat';
  }

  @Delete(':id')
  deleteCat() {
    return 'delete Cat';
  }
}
