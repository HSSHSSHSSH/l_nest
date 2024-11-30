import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return fs.readFileSync('./index.html', 'utf-8');
  }
}
