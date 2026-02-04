import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { loginId, password, nickname } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { loginId },
    });

    if (existingUser) {
      throw new ConflictException('该账号已被注册');
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        loginId,
        password: hashedPassword,
        nickname: nickname || loginId,
        updateArt: new Date(),
      },
    });

    // 生成 token
    const token = await this.generateToken(user);

    return {
      user: {
        id: user.id,
        loginId: user.loginId,
        nickname: user.nickname,
        role: user.role,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { loginId, password } = loginDto;

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { loginId },
    });

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 生成 token
    const token = await this.generateToken(user);

    return {
      id: user.id,
      loginId: user.loginId,
      nickname: user.nickname,
      role: user.role,
      token,
    };
  }

  private async generateToken(user: any) {
    const payload = {
      id: user.id,
      loginId: user.loginId,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        loginId: true,
        nickname: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }
}
