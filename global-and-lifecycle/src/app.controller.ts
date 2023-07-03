import { AaaException } from './AaaException';
import { AaaFilter } from './aaa.filter';
import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseFilters(AaaFilter)
  getHello(): string {
    throw new AaaException('aaa', 'bbb');
    return this.appService.getHello();
  }
}
