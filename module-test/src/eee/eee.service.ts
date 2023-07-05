import { Injectable } from '@nestjs/common';
import { CreateEeeDto } from './dto/create-eee.dto';
import { UpdateEeeDto } from './dto/update-eee.dto';

@Injectable()
export class EeeService {
  create(createEeeDto: CreateEeeDto) {
    return 'This action adds a new eee';
  }

  findAll() {
    return `This action returns all eee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eee`;
  }

  update(id: number, updateEeeDto: UpdateEeeDto) {
    return `This action updates a #${id} eee`;
  }

  remove(id: number) {
    return `This action removes a #${id} eee`;
  }
}
