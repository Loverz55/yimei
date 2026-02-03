import { Module } from '@nestjs/common';
import { ModelReqService } from './model-req.service';
import { ModelReqController } from './model-req.controller';

@Module({
  controllers: [ModelReqController],
  providers: [ModelReqService],
})
export class ModelReqModule {}
