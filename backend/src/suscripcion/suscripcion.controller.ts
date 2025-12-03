import { Controller, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Controller('suscripciones')
export class SuscripcionController {
  constructor(private readonly service: SuscripcionService) { }

  @Post()
  async crear(@Body() dto: CreateSuscripcionDto) {
    return this.service.crear(dto);
  }

  @Put(':id_usuario/plan/:id_plan')
  async cambiarPlan(
    @Param('id_usuario') id_usuario: number,
    @Param('id_plan') id_plan: number,
    @Body('mesesContratados') mesesContratados: number,
  ) {
    return this.service.cambiarPlan(id_usuario, id_plan, mesesContratados);
  }


  @Delete(':id')
  async cancelar(@Param('id') preapprovalId: string) {
    return this.service.cancelar(preapprovalId);
  }
}

