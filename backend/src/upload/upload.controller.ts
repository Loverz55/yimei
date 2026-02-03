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

@Controller('upload')
@ApiTags('上传对象存储')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: '获取预签名上传URL' })
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto.contentType);
  }

  @Put('confirm')
  @ApiOperation({ summary: '确认文件上传成功' })
  confirmUpload(@Body() confirmUploadDto: ConfirmUploadDto) {
    return this.uploadService.confirmUpload(
      confirmUploadDto.fileId,
      confirmUploadDto.size,
    );
  }

  @Get(':fileId/url')
  @ApiOperation({ summary: '根据文件ID获取访问URL' })
  getFileUrl(
    @Param('fileId') fileId: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    return this.uploadService.getFileUrl(parseInt(fileId), expires);
  }

  @Get('by-key')
  @ApiOperation({ summary: '根据key获取访问URL' })
  getFileUrlByKey(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    return this.uploadService.getFileUrlByKey(key, expires);
  }

  @Get(':fileId')
  @ApiOperation({ summary: '获取文件信息' })
  getFileById(@Param('fileId') fileId: string) {
    return this.uploadService.getFileById(parseInt(fileId));
  }
}
