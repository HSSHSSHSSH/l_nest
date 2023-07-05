import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface FffModuleOptions {
  aaa: number;
  bbb: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FffModuleOptions>().build();
