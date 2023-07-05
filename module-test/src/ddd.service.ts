import { CccService } from './ccc.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DddService {
  constructor(private cccService: CccService) {}

  ddd() {
    return 'dddService';
  }

  cind() {
    return this.cccService.ccc() + 'in dddService';
  }
}
