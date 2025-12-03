import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create.detalleVenta.dto';
import { UpdateDetalleVentaDto } from './dto/update.detalleVenta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalleVenta.entity';
import { Repository } from 'typeorm';
import { Venta } from '../venta/entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class DetalleVentaService {

    constructor(
        @InjectRepository(DetalleVenta)
        private readonly detalleVentaRepo: Repository<DetalleVenta>,

        @InjectRepository(Producto)
        private readonly ProductoRepo: Repository<Producto>,

        @InjectRepository(Venta)
        private readonly VentaRepo: Repository<Venta>,
    ) { }

    async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
        
        const venta = await this.VentaRepo.findOneBy({ id_venta: createDetalleVentaDto.id_venta });
        if (!venta) {
            throw new NotFoundException(`Venta con id ${{id_venta: createDetalleVentaDto.id_venta }} no encontrada`);
        }
        const producto = await this.ProductoRepo.findOneBy({ id_producto: createDetalleVentaDto.id_producto });
        if (!producto) {
            throw new NotFoundException(`Producto con id ${{id_producto: createDetalleVentaDto.id_producto}} no encontrado`);
        }
        const subtotal = producto.precio * createDetalleVentaDto.cantidad;

        const detalleVenta = this.detalleVentaRepo.create({
            cantidad: createDetalleVentaDto.cantidad,
            subtotal,
            venta,
            producto,
        });
        return await this.detalleVentaRepo.save(detalleVenta);
    }


    async findAll(): Promise<DetalleVenta[]> {
        return await this.detalleVentaRepo.find({relations: ['venta', 'producto'] });
    }

    async findOne(id: number): Promise<DetalleVenta> {
        const detalleVenta = await this.detalleVentaRepo.findOne({ where: { id_detalleVenta: id }, relations: ['venta', 'producto'] });
        if (!detalleVenta) {
            throw new NotFoundException(`Venta con id ${id} no encontrada`);
        }
        return detalleVenta;
    }

    // update(id: number, updatedetalleVentaDto: UpdateDetalleVentaDto) {
    //     return `This action updates a #${id} venta`;
    // }

    async remove(id: number): Promise<DetalleVenta> {
        const detalleVenta = await this.findOne(id);
        if(!detalleVenta) {
            throw new NotFoundException(`Venta con id ${id} no encontrada`);
        }
        return await this.detalleVentaRepo.remove(detalleVenta);
    }
}
