// import { AaaModule } from './../aaa/aaa.module';
import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';

@Module({
  // imports: [AaaModule],
  controllers: [BbbController],
  providers: [BbbService],
})
export class BbbModule {}
