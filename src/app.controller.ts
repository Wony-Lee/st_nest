import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsService } from './cats/service/cats.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
    // return this.appService.getHello();
  }
}
