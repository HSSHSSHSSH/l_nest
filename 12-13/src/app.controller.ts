import { AaaException } from './AaaException';
import { AaaFilter } from './aaa.filter';
import {
  Controller,
  Get,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AaaGuard } from './aaa.guard';
import { Roles } from './roles.decorator';
import { Role } from './role';
import { AaaInterceptor } from './aaa.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseFilters(AaaFilter)
  @UseGuards(AaaGuard)
  @UseInterceptors(AaaInterceptor)
  @SetMetadata('roles', [Role.Admin])
  // @Roles(Role.Admin)
  getHello(): string {
    // throw new AaaException('aaa', 'bbb');
    return this.appService.getHello();
  }
}
