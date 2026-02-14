import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PaginationQueryDto } from 'src/common/dto/common.dto';
import { success } from 'src/common/result';
import { Role, Roles, UserInfo } from 'src/auth/decorators';
import { TokenDto } from 'src/auth/dto/auth.dto';

@Controller('user')
@ApiTags('用户相关')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return success('创建用户成功', res);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '获取所有用户' })
  async findAll(@Query() query: PaginationQueryDto) {
    const res = await this.userService.findAll(query.page, query.pageSize);
    return success('获取数据成功', res.data, res.pagination);
  }

  @Get('info')
  @ApiOperation({ summary: '获取个人用户信息' })
  async findUserInfo(@UserInfo() user: TokenDto) {
    const res = await this.userService.findOne(+user.id);
    return success('获取数据成功', res);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '获取用户信息' })
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(+id);
    return success('获取数据成功', res);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '修改用户信息' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '删除用户信息' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
