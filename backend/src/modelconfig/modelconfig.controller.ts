import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ModelconfigService } from './modelconfig.service';
import {
  CreateModelconfigDto,
  UpdateModelconfigDto,
} from './dto/modelconfig.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('modelconfig')
@ApiTags('模型列表')
export class ModelconfigController {
  constructor(private readonly modelconfigService: ModelconfigService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createModelconfigDto: CreateModelconfigDto) {
    return this.modelconfigService.create(createModelconfigDto);
  }

  @Get()
  findAll() {
    return this.modelconfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelconfigService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModelconfigDto: UpdateModelconfigDto,
  ) {
    return this.modelconfigService.update(+id, updateModelconfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelconfigService.remove(+id);
  }
}
