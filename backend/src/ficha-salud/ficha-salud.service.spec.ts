import { Test, TestingModule } from '@nestjs/testing';
import { FichaSaludService } from './ficha-salud.service';

describe('FichaSaludService', () => {
  let service: FichaSaludService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichaSaludService],
    }).compile();

    service = module.get<FichaSaludService>(FichaSaludService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
