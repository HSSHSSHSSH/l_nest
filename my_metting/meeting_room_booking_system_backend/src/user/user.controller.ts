import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/userRegister.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user-dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo, PartialUserInfo, UserInfo } from './vo/login_user.vo';
import {
  RequireLogin,
  UserDec,
} from 'src/decorator/login_permission.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

interface Email {
  to: string;
  subject: string;
  html: string;
}

@ApiTags('用户管理模块儿')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  async captchaEmail(
    address: string,
    redisPrefix: string,
    code: string,
    email: Email,
  ) {
    await this.redisService.set(`${redisPrefix}${address}`, code, 60);

    await this.emailService.sendMail(email);
    return '发送成功';
  }

  // 注册用户时发送验证码
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async registerCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    return await this.captchaEmail(address, 'register_captcha', code, {
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p> 嘿嘿嘿`,
    });
  }
  // 用户更改密码时发送验证码
  @Get('update-password-captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    return await this.captchaEmail(address, 'update_password_captcha_', code, {
      to: address,
      subject: '改密码！！！',
      html: `<p>更改密码的验证码是这个： ${code}</p>`,
    });
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return '初始化数据初始好了';
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo,
  })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.accessToken = this.generateAccessToken(vo.userInfo);

    vo.refreshToken = this.generateRefreshToken(vo.userInfo);
    return { message: 'user login success', ...vo };
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.accessToken = this.generateAccessToken(vo.userInfo);

    vo.refreshToken = this.generateRefreshToken(vo.userInfo);
    return { message: 'admin login success', ...vo };
  }

  // 刷新 token
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId, false);

      const access_token = this.generateAccessToken(user);

      const refresh_token = this.generateRefreshToken(user);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token 失效了！！');
    }
  }
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const access_token = this.generateAccessToken(user);

      const refresh_token = this.generateRefreshToken(user);

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  // 获取用户信息
  @Get('info')
  @RequireLogin()
  async info(@UserDec('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }

  // 修改密码
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserDec('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  // 修改用户信息
  @Post(['user-update', 'admin-update'])
  @RequireLogin()
  async updateUser(
    @UserDec('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserInfo(userId, updateUserDto);
  }

  // 冻结用户
  @Put('freeze')
  async freeze(@Body('id') id: number) {
    await this.userService.freezeUserById(id);
    return 'success';
  }
  // 用户分页查询
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(1),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsers(
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    );
  }

  // 生成 accessToken
  generateAccessToken(userInfo: UserInfo | PartialUserInfo) {
    return this.jwtService.sign(
      {
        userId: userInfo.id,
        username: userInfo.username,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }
  // 生成 refreshToken
  generateRefreshToken(userInfo: UserInfo | PartialUserInfo) {
    return this.jwtService.sign(
      {
        userId: userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
  }
}
