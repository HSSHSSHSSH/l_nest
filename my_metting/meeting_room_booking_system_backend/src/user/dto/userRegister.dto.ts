import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, isEmail } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '账号不可为空',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '昵称不可为空',
  })
  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '比 6 个还短？？',
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty({
    message: '邮箱不可为空',
  })
  @IsEmail(
    {},
    {
      message: '是正经邮箱??',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: '验证码不填？？？',
  })
  @ApiProperty()
  captcha: string;
}
