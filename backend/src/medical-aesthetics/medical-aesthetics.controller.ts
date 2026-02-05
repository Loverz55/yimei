import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MedicalAestheticsService } from './medical-aesthetics.service';
import {
  CreateMedicalAestheticDto,
  UpdateMedicalAestheticDto,
} from './dto/medical-aesthetic.dto';
import { success } from 'src/common/result';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('medical-aesthetics')
@ApiBearerAuth()
@ApiTags('前端提示词库')
@UseGuards(JwtAuthGuard)
export class MedicalAestheticsController {
  constructor(
    private readonly medicalAestheticsService: MedicalAestheticsService,
  ) {}

  @Post()
  async create(@Body() createMedicalAestheticDto: CreateMedicalAestheticDto) {
    const res = await this.medicalAestheticsService.create(
      createMedicalAestheticDto,
    );
    return success('创建提示词标签成功', res);
  }

  @Get()
  async findAll() {
    const res = await this.medicalAestheticsService.findAll();
    return success('返回所有提示词标签', res);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalAestheticDto: UpdateMedicalAestheticDto,
  ) {
    const res = await this.medicalAestheticsService.update(
      +id,
      updateMedicalAestheticDto,
    );
    return success('更新提示词成功', res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.medicalAestheticsService.remove(+id);
    return success('删除提示词成功', res);
  }
}
