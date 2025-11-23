import { Test, TestingModule } from '@nestjs/testing';
import { DificultadService } from './dificultad.service';

describe('DificultadService', () => {
  let service: DificultadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DificultadService],
    }).compile();

    service = module.get<DificultadService>(DificultadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
