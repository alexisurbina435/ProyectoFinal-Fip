import { Test, TestingModule } from '@nestjs/testing';
import { DetalleVentaController } from './detalle-venta.controller';

describe('DetalleVentaController', () => {
  let controller: DetalleVentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleVentaController],
    }).compile();

    controller = module.get<DetalleVentaController>(DetalleVentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
