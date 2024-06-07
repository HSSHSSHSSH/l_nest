import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: '密码不填？？',
  })
  @MinLength(6, {
    message: '6个都没有？？？',
  })
  password: string;

  @IsNotEmpty({
    message: '邮箱不填？？',
  })
  @IsEmail(
    {},
    {
      message: '是正经邮箱吗？？',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '验证码不填？？',
  })
  captcha: string;
}
