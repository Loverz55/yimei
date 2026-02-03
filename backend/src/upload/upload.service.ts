import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { success } from 'src/common/result';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly s3: S3Client,
    private readonly prisma: PrismaService,
  ) {}

  async create(contentType: string, userId?: number) {
    const bucket = this.appConfig.s3Config.bucket;

    // 生成唯一的文件名
    const fileExtension = this.getFileExtension(contentType);
    const uniqueFileName = `${randomUUID()}${fileExtension}`;
    const key = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uniqueFileName}`;

    // 创建数据库记录（状态为pending）
    const file = await this.prisma.client.file.create({
      data: {
        key,
        contentType,
        status: 'pending',
        userId,
      },
    });

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 60 * 5 });

    return success('成功返回上传地址', {
      fileId: file.id,
      key: key,
      url: url,
    });
  }

  // 确认上传成功
  async confirmUpload(fileId: number, size?: number) {
    const file = await this.prisma.client.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('文件记录不存在');
    }

    const updatedFile = await this.prisma.client.file.update({
      where: { id: fileId },
      data: {
        status: 'uploaded',
        size: size || file.size,
      },
    });

    return success('确认上传成功', {
      fileId: updatedFile.id,
      key: updatedFile.key,
      status: updatedFile.status,
    });
  }

  // 获取文件访问URL（生成GET预签名URL）
  async getFileUrl(fileId: number, expiresIn: number = 60 * 60) {
    const file = await this.prisma.client.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('文件记录不存在');
    }

    if (file.status !== 'uploaded') {
      throw new UnauthorizedException('文件未上传或已删除');
    }

    const bucket = this.appConfig.s3Config.bucket;

    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: file.key,
    });

    const url = await getSignedUrl(this.s3, cmd, { expiresIn });

    return success('成功获取文件访问URL', {
      fileId: file.id,
      key: file.key,
      url: url,
      contentType: file.contentType,
      size: file.size,
    });
  }

  // 根据key获取文件访问URL
  async getFileUrlByKey(key: string, expiresIn: number = 60 * 60) {
    const file = await this.prisma.client.file.findUnique({
      where: { key },
    });

    if (!file) {
      throw new NotFoundException('文件记录不存在');
    }

    if (file.status !== 'uploaded') {
      throw new UnauthorizedException('文件未上传或已删除');
    }

    const bucket = this.appConfig.s3Config.bucket;

    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: file.key,
    });

    const url = await getSignedUrl(this.s3, cmd, { expiresIn });

    return success('成功获取文件访问URL', {
      fileId: file.id,
      key: file.key,
      url: url,
      contentType: file.contentType,
      size: file.size,
    });
  }

  // 获取文件信息
  async getFileById(fileId: number) {
    const file = await this.prisma.client.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('文件记录不存在');
    }

    return success('成功获取文件信息', file);
  }

  private getFileExtension(contentType: string): string {
    const mimeTypes: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
    };

    return mimeTypes[contentType] || '';
  }
}
