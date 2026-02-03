import { Injectable } from '@nestjs/common';
import { CreateModelReqDto } from './dto/create-model-req.dto';
import { UpdateModelReqDto } from './dto/update-model-req.dto';

@Injectable()
export class ModelReqService {
  create(createModelReqDto: CreateModelReqDto) {
    return 'This action adds a new modelReq';
  }

  findAll() {
    return `This action returns all modelReq`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelReq`;
  }

  update(id: number, updateModelReqDto: UpdateModelReqDto) {
    return `This action updates a #${id} modelReq`;
  }

  remove(id: number) {
    return `This action removes a #${id} modelReq`;
  }
}
