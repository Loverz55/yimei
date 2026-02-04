import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageGenController } from './image-gen.controller';
import { ImageGenService } from './image-gen.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from 'src/upload/upload.service';
import { S3Client } from '@aws-sdk/client-s3';
import { BaseImageProvider } from './providers/base.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  imports: [HttpModule, PrismaModule, UploadModule],
  controllers: [ImageGenController],
  providers: [ImageGenService, UploadService, S3Client],
  exports: [ImageGenService],
})
export class ImageGenModule {}
