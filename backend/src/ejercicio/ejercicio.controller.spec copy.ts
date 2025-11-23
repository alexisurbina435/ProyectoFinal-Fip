import { Test, TestingModule } from '@nestjs/testing';
import { EjercicioController } from './ejercicio.controller';

describe('EjercicioController', () => {
  let controller: EjercicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EjercicioController],
    }).compile();

    controller = module.get<EjercicioController>(EjercicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
