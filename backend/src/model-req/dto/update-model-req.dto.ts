import { PartialType } from '@nestjs/swagger';
import { CreateModelReqDto } from './create-model-req.dto';

export class UpdateModelReqDto extends PartialType(CreateModelReqDto) {}
