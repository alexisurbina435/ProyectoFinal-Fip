import { Controller, Post, Body, Get, Param, Patch, Delete, InternalServerErrorException } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { tr } from 'date-fns/locale';

@Controller('carrito')
export class CarritoController {
    constructor(private readonly carritoService: CarritoService) { }

    @Post()
    async createCarrito(@Body() dto: CreateCarritoDto) {
        try {
            return this.carritoService.createCarrito(dto.id_usuario);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    
    @Get('usuario/:id_usuario')
    async getByUsuario(@Param('id_usuario') userId: string) {
        try {
            return this.carritoService.getCarritoByUsuario(+userId);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        try {
            return this.carritoService.getCarritoById(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    
    @Post(':id/item')
    async addItem(@Param('id') id: string, @Body() dto: AddItemDto) {
        try {
            return this.carritoService.addItem(+id, dto.productoId, dto.cantidad);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('item/:itemId')
    async updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateItemDto) {
        try {
            return this.carritoService.updateCantidad(+itemId, dto.cantidad);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete('item/:itemId')
    async deleteItem(@Param('itemId') itemId: string) {
        try {
            return this.carritoService.deleteItem(+itemId);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    async deleteCarrito(@Param('id') id: string) {
        try {
            return this.carritoService.deleteCarrito(+id);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    // sincronizar: frontend envía el carrito actual al hacer login
    @Post('usuario/:id_usuario/sincronizar')
    async sincronizar(@Param('id_usuario') id_usuario: string, @Body() body: { productos: { id: number; cantidad: number }[] }) {
        try {
            return this.carritoService.sincronizarCarrito(+id_usuario, body.productos);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
