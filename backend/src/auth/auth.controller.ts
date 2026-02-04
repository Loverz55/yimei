import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, TokenDto } from './dto/auth.dto';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserInfo } from './decorators/current-user.decorator';
import { User } from 'generated/prisma/client';
import { success } from '../common/result';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 409, description: '账号已存在' })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return success('注册成功', data);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '账号或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return success('登录成功', data);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getProfile(@UserInfo() user: TokenDto) {
    const data = await this.authService.validateUser(user.id);
    return success('获取成功', data);
  }
}
