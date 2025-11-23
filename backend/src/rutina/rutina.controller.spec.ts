import { Test, TestingModule } from '@nestjs/testing';
import { RutinaController } from './rutina.controller';

describe('RutinasController', () => {
  let controller: RutinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RutinaController],
    }).compile();

    controller = module.get<RutinaController>(RutinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
