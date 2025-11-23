import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
// import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(@Body() createVentaDto: CreateVentaDto): Promise<Venta> {
    try{
      return await this.ventaService.create(createVentaDto);
    }catch(error){
      throw new HttpException('Error al crear la venta', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Venta[]> {
    try{
      return this.ventaService.findAll();
    }catch(error){
      throw new HttpException('Error al obtener las ventas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Venta> {
    try{
      return this.ventaService.findOne(+id);
    }catch(error){
      throw new HttpException('Error al obtener la venta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
  //   return this.ventaService.update(+id, updateVentaDto);
  // }

 @Delete(':id')
  async remove(@Param('id') id: string): Promise<Venta> {
    try{
      return this.ventaService.remove(+id);
    }catch(error){
      throw new HttpException('Error al eliminar la venta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
