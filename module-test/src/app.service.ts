import { DddService } from './ddd.service';
import { CccService } from './ccc.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private cccService: CccService, private dddService: DddService) {}
  getHello(): string {
    return 'Hello World!' + this.cccService.ccc() + this.dddService.ddd();
  }
}
