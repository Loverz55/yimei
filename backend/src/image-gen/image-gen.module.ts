import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageGenController } from './image-gen.controller';
import { ImageGenService } from './image-gen.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [HttpModule, PrismaModule, UploadModule],
  controllers: [ImageGenController],
  providers: [ImageGenService],
  exports: [ImageGenService],
})
export class ImageGenModule {}
