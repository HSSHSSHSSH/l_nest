import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: '不填账号是吗？？？',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '没有密码是吗？？？',
  })
  @ApiProperty()
  password: string;
}
