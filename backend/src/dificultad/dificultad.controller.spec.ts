import { Test, TestingModule } from '@nestjs/testing';
import { DificultadController } from './dificultad.controller';
import { DificultadService } from './dificultad.service';

describe('DificultadController', () => {
  let controller: DificultadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DificultadController],
      providers: [DificultadService],
    }).compile();

    controller = module.get<DificultadController>(DificultadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
