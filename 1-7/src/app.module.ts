import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';

@Module({
  imports: [PersonModule],
  controllers: [AppController],
  providers: [
    {
      provide: 'app_service',
      useClass: AppService,
    },
    {
      provide: 'person',
      useValue: {
        name: '张三',
        age: 18,
      },
    },
    {
      provide: 'person2',
      useFactory(
        person: { name: string; age: number },
        appService: AppService,
      ) {
        return {
          name: person.name + '2',
          desc: appService.getHello(),
        };
      },
      inject: ['person', 'app_service'], // 依赖注入
    },
  ],
})
export class AppModule {}
