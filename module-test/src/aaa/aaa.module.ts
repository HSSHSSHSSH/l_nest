import { BbbModule } from './../bbb/bbb.module';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => BbbModule)],
})
export class AaaModule {}
