import { Module } from '@nestjs/common';
import { ModelconfigService } from './modelconfig.service';
import { ModelconfigController } from './modelconfig.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [ModelconfigController],
  providers: [ModelconfigService, PrismaService],
  exports: [ModelconfigService],
})
export class ModelconfigModule {}
