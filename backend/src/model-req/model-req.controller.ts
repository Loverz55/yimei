import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModelReqService } from './model-req.service';
import { CreateModelReqDto } from './dto/create-model-req.dto';
import { UpdateModelReqDto } from './dto/update-model-req.dto';

@Controller('model-req')
export class ModelReqController {
  constructor(private readonly modelReqService: ModelReqService) {}

  @Post()
  create(@Body() createModelReqDto: CreateModelReqDto) {
    return this.modelReqService.create(createModelReqDto);
  }

  @Get()
  findAll() {
    return this.modelReqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelReqService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModelReqDto: UpdateModelReqDto) {
    return this.modelReqService.update(+id, updateModelReqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modelReqService.remove(+id);
  }
}
