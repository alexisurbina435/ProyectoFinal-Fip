import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Controller('suscripciones')
export class SuscripcionController {
  constructor(private readonly service: SuscripcionService) {}

  @Post()
  async crear(@Body() dto: CreateSuscripcionDto) {
    return this.service.crear(dto);
  }

  @Delete(':id')
  async cancelar(@Param('id') preapprovalId: string) {
    return this.service.cancelar(preapprovalId);
  }
}


