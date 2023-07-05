import { PartialType } from '@nestjs/mapped-types';
import { CreateEeeDto } from './create-eee.dto';

export class UpdateEeeDto extends PartialType(CreateEeeDto) {}
