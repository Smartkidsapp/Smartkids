import { Test, TestingModule } from '@nestjs/testing';
import { BoostageService } from './boostage.service';

describe('BoostageService', () => {
  let service: BoostageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoostageService],
    }).compile();

    service = module.get<BoostageService>(BoostageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
