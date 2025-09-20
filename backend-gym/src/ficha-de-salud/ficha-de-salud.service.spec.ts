import { Test, TestingModule } from '@nestjs/testing';
import { FichaDeSaludService } from './ficha-de-salud.service';

describe('FichaDeSaludService', () => {
  let service: FichaDeSaludService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichaDeSaludService],
    }).compile();

    service = module.get<FichaDeSaludService>(FichaDeSaludService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
