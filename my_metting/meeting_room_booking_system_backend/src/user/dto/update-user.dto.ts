import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  headPic: string;
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不填？？',
  })
  @IsEmail(
    {},
    {
      message: '是正经邮箱？？',
    },
  )
  email: string;
}
