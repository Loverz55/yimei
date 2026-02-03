import { Module } from '@nestjs/common';
import { ModelconfigService } from './modelconfig.service';
import { ModelconfigController } from './modelconfig.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ModelconfigController],
  providers: [ModelconfigService],
})
export class ModelconfigModule {}
