import { Test, TestingModule } from '@nestjs/testing';
import { BoostageController } from './boostage.controller';

describe('BoostageController', () => {
  let controller: BoostageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoostageController],
    }).compile();

    controller = module.get<BoostageController>(BoostageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
