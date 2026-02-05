import { Module } from '@nestjs/common';
import { MedicalAestheticsService } from './medical-aesthetics.service';
import { MedicalAestheticsController } from './medical-aesthetics.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MedicalAestheticsController],
  providers: [MedicalAestheticsService, PrismaService],
})
export class MedicalAestheticsModule {}
