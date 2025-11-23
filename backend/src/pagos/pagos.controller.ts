import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create.pago.dto';
import { UpdatePagoDto } from './dto/update.pago.dto';
import { Pago } from './entities/pago.entity';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get()
  async getAllPagos(): Promise<Pago[]> {
    return this.pagosService.getAllPagos();
  }

  @Get(':id')
  async getPagoById(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return this.pagosService.getPagoById(id);
  }

  @Post()
  async createPago(@Body() createPagoDto: CreatePagoDto): Promise<Pago> {
    return this.pagosService.createPago(createPagoDto);
  }

  @Patch(':id')
  async updatePago(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagoDto: UpdatePagoDto,
  ): Promise<Pago> {
    return this.pagosService.updatePago(id, updatePagoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePago(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.pagosService.deletePago(id);
  }
}
