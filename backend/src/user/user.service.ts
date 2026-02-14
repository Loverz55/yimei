import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { loginId, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { loginId },
    });

    if (existingUser) {
      throw new ConflictException('该账号已被注册');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const res = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return res;
  }

  async findAll(page = 1, pageSize = 10) {
    const res = await this.prisma.paginate(this.prisma.user, {
      page,
      pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        loginId: true,
        nickname: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
    });
    return res;
  }

  async findOne(id: number) {
    const res = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        loginId: true,
        nickname: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
    });

    if (!res) {
      throw new NotFoundException('未找到用户');
    }

    return res;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    const res = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
      select: {
        id: true,
        loginId: true,
        nickname: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
    });

    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
