import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('app_service') private readonly appService: AppService,
    @Inject('person') private readonly person: { name: string; age: number },
    @Inject('person2') private readonly person2: { name: string; desc: number },
  ) {}
  // @Inject(AppService)
  // private readonly appService: AppService;

  @Get()
  getHello(): string {
    console.log('蛙叫你', this.person);
    console.log('哇哇哇', this.person2);
    return this.appService.getHello();
  }
}
