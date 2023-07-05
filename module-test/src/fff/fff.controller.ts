import { Controller, Get, Inject } from '@nestjs/common';
import {
  MODULE_OPTIONS_TOKEN,
  FffModuleOptions,
} from './fff.module-definitions';

@Controller('fff')
export class FffController {
  @Inject(MODULE_OPTIONS_TOKEN)
  private options: FffModuleOptions;

  @Get('')
  hello() {
    return this.options;
  }
}
