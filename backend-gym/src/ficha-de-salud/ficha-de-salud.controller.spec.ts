import { Test, TestingModule } from '@nestjs/testing';
import { FichaDeSaludController } from './ficha-de-salud.controller';
import { FichaDeSaludService } from './ficha-de-salud.service';

describe('FichaDeSaludController', () => {
  let controller: FichaDeSaludController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichaDeSaludController],
      providers: [FichaDeSaludService],
    }).compile();

    controller = module.get<FichaDeSaludController>(FichaDeSaludController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
