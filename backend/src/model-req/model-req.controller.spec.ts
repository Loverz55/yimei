import { Test, TestingModule } from '@nestjs/testing';
import { ModelReqController } from './model-req.controller';
import { ModelReqService } from './model-req.service';

describe('ModelReqController', () => {
  let controller: ModelReqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelReqController],
      providers: [ModelReqService],
    }).compile();

    controller = module.get<ModelReqController>(ModelReqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
