import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { CccService } from './ccc.service';
import { DddService } from './ddd.service';
import { EeeModule } from './eee/eee.module';
import { FffModule } from './fff/fff.module';

@Module({
  imports: [
    AaaModule,
    BbbModule,
    EeeModule.register({ action: '蛙叫你' }),
    FffModule.register({ aaa: 123, bbb: 'bbb' }),
  ],
  controllers: [AppController],
  providers: [AppService, CccService, DddService],
})
export class AppModule {}
