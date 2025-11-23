import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { UpdateDetalleVentaDto } from './dto/update.detalleVenta.dto';
import { CreateDetalleVentaDto } from './dto/create.detalleVenta.dto';
import { DetalleVenta } from './entities/detalleVenta.entity';

@Controller('detalle-venta')
export class DetalleVentaController {
    constructor(
        private readonly detalleVentaService: DetalleVentaService
    ) { }


    @Post()
    async create(@Body() createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
        try{
            return await this.detalleVentaService.create(createDetalleVentaDto);
        }catch(error){
            throw new HttpException('Error al crear la venta', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll(): Promise<DetalleVenta[]> {
        try{
            return this.detalleVentaService.findAll();
        }catch(error){
            throw new HttpException('Error al obtener las ventas', HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<DetalleVenta> {
        try{
            return this.detalleVentaService.findOne(+id);
        }catch(error){
            throw new HttpException('Error al obtener la venta', HttpStatus.BAD_REQUEST);
        }
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateVentaDto: UpdateDetalleVentaDto) {
    //     return this.detalleVentaService.update(+id, updateVentaDto);
    // }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DetalleVenta> {
        try{
            return this.detalleVentaService.remove(+id);
        }catch(error){
            throw new HttpException('Error al eliminar la venta', HttpStatus.BAD_REQUEST);
        }   
    }
}
