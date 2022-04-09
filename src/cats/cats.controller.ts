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
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from '../http-exception.filter';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // localhost:8000/cats
  @Get()
  @UseFilters(HttpExceptionFilter)
  getAllCat() {
    throw new HttpException('api is broken', 401);
    return 'All Cat';
  }

  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe) param: number) {
    console.log('id ==>', param);
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
