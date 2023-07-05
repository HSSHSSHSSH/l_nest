import { Module, DynamicModule } from '@nestjs/common';
import { EeeService } from './eee.service';
import { EeeController } from './eee.controller';

@Module({
  controllers: [EeeController],
  providers: [EeeService],
})
export class EeeModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: EeeModule,
      controllers: [EeeController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EeeService,
      ],
      exports: [],
    };
  }
}
