import { Injectable } from '@nestjs/common';
import {
  CreateModelconfigDto,
  UpdateModelconfigDto,
} from './dto/modelconfig.dto';

@Injectable()
export class ModelconfigService {
  create(createModelconfigDto: CreateModelconfigDto) {
    return 'This action adds a new modelconfig';
  }

  findAll() {
    return `This action returns all modelconfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelconfig`;
  }

  update(id: number, updateModelconfigDto: UpdateModelconfigDto) {
    return `This action updates a #${id} modelconfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelconfig`;
  }
}
