import { Test, TestingModule } from '@nestjs/testing';
import { ModelReqService } from './model-req.service';

describe('ModelReqService', () => {
  let service: ModelReqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelReqService],
    }).compile();

    service = module.get<ModelReqService>(ModelReqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
