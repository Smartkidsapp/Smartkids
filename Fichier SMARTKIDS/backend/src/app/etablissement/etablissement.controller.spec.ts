import { Test, TestingModule } from '@nestjs/testing';
import { EtablissementController } from './etablissement.controller';

describe('EtablissementController', () => {
  let controller: EtablissementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtablissementController],
    }).compile();

    controller = module.get<EtablissementController>(EtablissementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
