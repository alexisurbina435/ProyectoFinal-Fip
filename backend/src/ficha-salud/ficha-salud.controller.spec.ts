import { Test, TestingModule } from '@nestjs/testing';
import { FichaSaludController } from './ficha-salud.controller';
import { FichaSaludService } from './ficha-salud.service';

describe('FichaSaludController', () => {
  let controller: FichaSaludController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichaSaludController],
      providers: [FichaSaludService],
    }).compile();

    controller = module.get<FichaSaludController>(FichaSaludController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
