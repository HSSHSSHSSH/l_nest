import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { EeeService } from './eee.service';
import { CreateEeeDto } from './dto/create-eee.dto';
import { UpdateEeeDto } from './dto/update-eee.dto';

@Controller('eee')
export class EeeController {
  constructor(
    private readonly eeeService: EeeService,
    @Inject('CONFIG_OPTIONS') private configOptions: Record<string, any>,
  ) {}

  @Post()
  create(@Body() createEeeDto: CreateEeeDto) {
    return this.eeeService.create(createEeeDto);
  }

  @Get()
  findAll() {
    console.log(this.configOptions);
    return this.eeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEeeDto: UpdateEeeDto) {
    return this.eeeService.update(+id, updateEeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eeeService.remove(+id);
  }
}
