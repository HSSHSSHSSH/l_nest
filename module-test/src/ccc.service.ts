import { DddService } from './ddd.service';
import { Injectable, forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class CccService {
  constructor(
    @Inject(forwardRef(() => DddService)) private dddService: DddService,
  ) {}
  ccc() {
    return 'cccService';
  }
  dinc() {
    return this.dddService.ddd() + 'in cccService';
  }
}
