import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
// import { MercadoPagoService } from 'src/mercadopago/mercadopago.service';

@Controller('suscripcion')
export class SuscripcionController {

  constructor(private readonly suscripcionService: SuscripcionService,
    // private readonly mpService: MercadoPagoService
  ) { }

  @Post()
  async createSuscripcion(@Body() dto: CreateSuscripcionDto) {
    // integrar metodo de pago aca 
    // const pagoConfirmado = await this.mpService.crearPreferencia();

    // // si el pago se cancela o da error devuelve error 
    // if (!pagoConfirmado) {
    //   throw new BadRequestException('El pago no se pudo procesar o fue cancelado');
    // }
    // si el pago se hizo crea la suscripcion 
    return this.suscripcionService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suscripcionService.delete(+id);
  }
}
