import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      return await this.productosService.create(createProductoDto);
    } catch (error) {
      throw new HttpException('Error al crear el producto', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Producto[]> {
    try {
      return await this.productosService.findAllProductos();
    } catch (error) {
      throw new HttpException('Error al obtener los productos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productosService.findOne(+id);
    } catch (error) {
      throw new HttpException(`Error al obtener el producto con el id ${id}`, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto): Promise<Producto>  {
    try {
      return await this.productosService.update(+id, updateProductoDto);
    } catch (error) {
      throw new HttpException(`Error al actualizar el producto con el id ${id}`, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Producto> {
    try {
      return await this.productosService.remove(+id);
    } catch (error) {
      throw new HttpException(`Error al eliminar el producto con el id ${id}`, HttpStatus.NOT_FOUND);
    }
  }
}
