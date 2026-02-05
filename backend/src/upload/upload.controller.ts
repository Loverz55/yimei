import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto, ConfirmUploadDto } from './dto/upload.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { success } from '../common/result';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserInfo } from '../auth/decorators/current-user.decorator';
import { TokenDto } from '../auth/dto/auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('upload')
@ApiTags('上传对象存储')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: '获取预签名上传URL' })
  async create(
    @Body() createUploadDto: CreateUploadDto,
    @UserInfo() user: TokenDto,
  ) {
    const data = await this.uploadService.create(
      createUploadDto.contentType,
      user.id,
    );
    return success('成功返回上传地址', data);
  }

  @Put('confirm')
  @ApiOperation({ summary: '确认文件上传成功' })
  async confirmUpload(
    @Body() confirmUploadDto: ConfirmUploadDto,
    @UserInfo() user: TokenDto,
  ) {
    const data = await this.uploadService.confirmUpload(
      confirmUploadDto.fileId,
      user.id,
      confirmUploadDto.size,
    );
    return success('确认上传成功', data);
  }

  @Get(':fileId/url')
  @ApiOperation({ summary: '根据文件ID获取访问URL' })
  async getFileUrl(
    @Param('fileId') fileId: string,
    @Query('expiresIn') expiresIn?: string,
    @UserInfo() user?: TokenDto,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    const data = await this.uploadService.getFileUrl(
      parseInt(fileId),
      user?.id || 0,
      expires,
    );
    return success('成功获取文件访问URL', data);
  }

  @Get('by-key')
  @ApiOperation({ summary: '根据key获取访问URL' })
  async getFileUrlByKey(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: string,
    @UserInfo() user?: TokenDto,
  ) {
    const expires = expiresIn ? parseInt(expiresIn) : 60 * 60;
    const data = await this.uploadService.getFileUrlByKey(
      key,
      user?.id || 0,
      expires,
    );
    return success('成功获取文件访问URL', data);
  }

  @Get(':fileId')
  @ApiOperation({ summary: '获取文件信息' })
  async getFileById(
    @Param('fileId') fileId: string,
    @UserInfo() user: TokenDto,
  ) {
    const data = await this.uploadService.getFileById(
      parseInt(fileId),
      user.id,
    );
    return success('成功获取文件信息', data);
  }
}
