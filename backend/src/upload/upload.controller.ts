import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto, UpdateUploadDto, ConfirmUploadDto } from './dto/upload.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { success } from '../common/result';

@Controller('upload')
@ApiTags('上传对象存储')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: '获取预签名上传URL' })
  async create(@Body() createUploadDto: CreateUploadDto) {
    const data = await this.uploadService.create(createUploadDto.contentType);
    return success('成功返回上传地址', data);
  }

  @Put('confirm')
  @ApiOperation({ summary: '确认文件上传成功' })
  async confirmUpload(@Body() confirmUploadDto: ConfirmUploadDto) {
    const data = await this.uploadService.confirmUpload(
      confirmUploadDto.fileId,
      confirmUploadDto.size,
    );
    return success('确认上传成功', data);
  }

  @Get(':fileId/url')
  @ApiOperation({ summary: '根据文件ID获取访问URL' })
  async getFileUrl(
    @Param('fileId') fileId: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    const data = await this.uploadService.getFileUrl(parseInt(fileId), expires);
    return success('成功获取文件访问URL', data);
  }

  @Get('by-key')
  @ApiOperation({ summary: '根据key获取访问URL' })
  async getFileUrlByKey(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    const data = await this.uploadService.getFileUrlByKey(key, expires);
    return success('成功获取文件访问URL', data);
  }

  @Get(':fileId')
  @ApiOperation({ summary: '获取文件信息' })
  async getFileById(@Param('fileId') fileId: string) {
    const data = await this.uploadService.getFileById(parseInt(fileId));
    return success('成功获取文件信息', data);
  }
}
