import { Module } from '@nestjs/common';
import { FffController } from './fff.controller';
import { ConfigurableModuleClass } from './fff.module-definitions';

@Module({
  controllers: [FffController],
})
export class FffModule extends ConfigurableModuleClass {}
