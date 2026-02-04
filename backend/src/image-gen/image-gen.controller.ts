import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImageGenService } from './image-gen.service';
import {
  GenerateImageDto,
  InpaintImageDto,
  GenerateImageResponseDto,
} from './dto/generate-image.dto';
import { Result, success, fail } from '../common/result';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('图像生成')
@Controller('image-gen')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImageGenController {
  constructor(private readonly imageGenService: ImageGenService) {}

  @Post('generate')
  @ApiOperation({ summary: '生成图片（文生图）' })
  async generateImage(@Body() dto: GenerateImageDto, @Req() req: any) {
    try {
      const userId = req.user.userId;
      const result = await this.imageGenService.generateImage(dto, userId);
      return success('图片生成成功', result);
    } catch (error) {
      return fail(error.message || '图片生成失败');
    }
  }

  @Post('inpaint')
  @ApiOperation({ summary: '图片局部修改（Inpainting）' })
  async inpaint(@Body() dto: InpaintImageDto, @Req() req: any) {
    try {
      const userId = req.user.userId;
      const result = await this.imageGenService.inpaint(dto, userId);
      return success('图片修改成功', result);
    } catch (error) {
      return fail(error.message || '图片修改失败');
    }
  }

  @Get('history')
  @ApiOperation({ summary: '获取用户的图片生成历史' })
  async getUserHistory(
    @Req() req: any,
    @Query('limit', ParseIntPipe) limit: number = 20,
    @Query('offset', ParseIntPipe) offset: number = 0,
  ): Promise<Result<any>> {
    try {
      const userId = req.user.userId;
      const generations = await this.imageGenService.getUserGenerations(
        userId,
        limit,
        offset,
      );
      return success('获取历史记录成功', generations);
    } catch (error) {
      return fail(error.message || '获取历史记录失败');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个生成记录详情' })
  async getGenerationById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Result<any>> {
    try {
      const userId = req.user.userId;
      const generation = await this.imageGenService.getGenerationById(
        id,
        userId,
      );
      return success('获取记录成功', generation);
    } catch (error) {
      return fail(error.message || '获取记录失败');
    }
  }

  @Get('providers/list')
  @ApiOperation({ summary: '获取所有可用的AI Provider配置列表' })
  async getAvailableProviders(): Promise<Result<any>> {
    try {
      const providers = await this.imageGenService.getAvailableProviders();
      return success('获取Provider列表成功', providers);
    } catch (error) {
      return fail(error.message || '获取Provider列表失败');
    }
  }

  @Post('providers/reload')
  @ApiOperation({ summary: '重新加载Provider配置（管理员）' })
  async reloadProviders(): Promise<Result<any>> {
    try {
      const result = await this.imageGenService.reloadProviders();
      return success(`Provider配置已重新加载，当前${result.count}个可用`, result);
    } catch (error) {
      return fail(error.message || '重新加载失败');
    }
  }
}
