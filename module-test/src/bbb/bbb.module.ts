import { AaaModule } from './../aaa/aaa.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => AaaModule)],
})
export class BbbModule {}
