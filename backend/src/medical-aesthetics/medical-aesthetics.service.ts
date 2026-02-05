import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateMedicalAestheticDto,
  UpdateMedicalAestheticDto,
} from './dto/medical-aesthetic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalAestheticsService {
  constructor(private prisma: PrismaService) {}
  async create(createMedicalAestheticDto: CreateMedicalAestheticDto) {
    const res = await this.prisma.medicalAesthetics.create({
      data: createMedicalAestheticDto,
    });

    return res;
  }

  async findAll() {
    const res = await this.prisma.medicalAesthetics.findMany();
    return res;
  }

  async findOne(id: number) {
    const res = await this.prisma.medicalAesthetics.findUnique({
      where: { id: id },
    });

    return res;
  }

  async update(
    id: number,
    updateMedicalAestheticDto: UpdateMedicalAestheticDto,
  ) {
    const existing = await this.prisma.medicalAesthetics.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new NotFoundException(`未找到ID为 ${id} 的配置`);
    }

    const res = await this.prisma.medicalAesthetics.update({
      where: { id: id },
      data: updateMedicalAestheticDto,
    });

    return res;
  }

  async remove(id: number) {
    const existing = await this.prisma.medicalAesthetics.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new NotFoundException(`未找到ID为 ${id} 的配置`);
    }

    await this.prisma.medicalAesthetics.delete({
      where: { id },
    });
  }
}
