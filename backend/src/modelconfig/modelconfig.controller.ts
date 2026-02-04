import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ModelconfigService } from './modelconfig.service';
import {
  CreateModelconfigDto,
  UpdateModelconfigDto,
  QueryModelconfigDto,
  ValidateConfigDto,
  CostStatsDto,
  RateLimitConfigDto,
  PresetParamsDto,
} from './dto/modelconfig.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('modelconfig')
@ApiTags('AI模型配置管理')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ModelconfigController {
  constructor(private readonly modelconfigService: ModelconfigService) {}

  @Post()
  @ApiOperation({ summary: '创建Provider配置' })
  create(@Body() createModelconfigDto: CreateModelconfigDto) {
    return this.modelconfigService.create(createModelconfigDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有Provider配置（支持筛选和分页）' })
  findAll(@Query() query: QueryModelconfigDto) {
    return this.modelconfigService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取Provider配置' })
  findOne(@Param('id') id: string) {
    return this.modelconfigService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新Provider配置' })
  update(
    @Param('id') id: string,
    @Body() updateModelconfigDto: UpdateModelconfigDto,
  ) {
    return this.modelconfigService.update(+id, updateModelconfigDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除Provider配置' })
  remove(@Param('id') id: string) {
    return this.modelconfigService.remove(+id);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: '验证配置是否有效（测试API Key）' })
  validateConfig(
    @Param('id') id: string,
    @Body() validateDto?: ValidateConfigDto,
  ) {
    return this.modelconfigService.validateConfig(+id, validateDto);
  }

  @Get(':id/cost-stats')
  @ApiOperation({ summary: '获取成本统计（按配置维度）' })
  getCostStats(@Param('id') id: string, @Query() statsDto?: CostStatsDto) {
    return this.modelconfigService.getCostStats(+id, statsDto);
  }

  @Post(':id/rate-limit')
  @ApiOperation({ summary: '设置请求限流（按配置维度）' })
  setRateLimit(
    @Param('id') id: string,
    @Body() rateLimitDto: RateLimitConfigDto,
  ) {
    return this.modelconfigService.setRateLimit(+id, rateLimitDto);
  }

  @Get(':id/rate-limit')
  @ApiOperation({ summary: '获取限流配置' })
  getRateLimit(@Param('id') id: string) {
    return this.modelconfigService.getRateLimit(+id);
  }

  @Post(':id/presets')
  @ApiOperation({ summary: '设置参数预设' })
  setPreset(@Param('id') id: string, @Body() presetDto: PresetParamsDto) {
    return this.modelconfigService.setPreset(+id, presetDto);
  }

  @Get(':id/presets')
  @ApiOperation({ summary: '获取所有参数预设' })
  getPresets(@Param('id') id: string) {
    return this.modelconfigService.getPresets(+id);
  }

  @Delete(':id/presets/:presetName')
  @ApiOperation({ summary: '删除参数预设' })
  deletePreset(
    @Param('id') id: string,
    @Param('presetName') presetName: string,
  ) {
    return this.modelconfigService.deletePreset(+id, presetName);
  }
}
