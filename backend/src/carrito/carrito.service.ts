import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoItem } from './entities/carrito-items.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito) private carritoRepo: Repository<Carrito>,
    @InjectRepository(CarritoItem) private itemRepo: Repository<CarritoItem>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
  ) { }

  async createCarrito(id_usuario?: number) {
    const carrito = this.carritoRepo.create({ usuario: id_usuario ? { id_usuario: id_usuario } as any : null, items: [] });
    return this.carritoRepo.save(carrito);
  }

  async getCarritoById(carritoId: number) {
    const carrito = await this.carritoRepo.findOne({
      where: { id_carrito: carritoId },
      relations: ['items', 'items.producto']
    });

    if (!carrito) throw new NotFoundException('Carrito no encontrado');
    return carrito;
  }

  async getCarritoByUsuario(id_usuario: number) {
    const carrito = await this.carritoRepo.findOne({
      where: { usuario: { id_usuario } },
      relations: ['items', 'items.producto']
    });

    return carrito;
  }

  async addItem(carritoId: number, productoId: number, cantidad = 1) {
    const carrito = await this.getCarritoById(carritoId);
    const producto = await this.productoRepo.findOne({ where: { id_producto: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    // verificar si ya existe el item
    const existente = carrito.items?.find(i => i.producto.id_producto === productoId);
    if (existente) {
      existente.cantidad += cantidad;
      return this.itemRepo.save(existente);
    }

    const item = this.itemRepo.create({
      carrito,
      producto,
      cantidad,
    });

    return this.itemRepo.save(item);
  }

  async updateCantidad(itemId: number, cantidad: number) {
    const item = await this.itemRepo.findOne({ where: { id_item: itemId } });
    if (!item) throw new NotFoundException('Item no encontrado');

    item.cantidad = cantidad;
    return this.itemRepo.save(item);
  }

  async deleteItem(itemId: number) {
    const item = await this.itemRepo.findOne({ where: { id_item: itemId } });
    if (!item) throw new NotFoundException('Item no encontrado');

    await this.itemRepo.delete(itemId);
    return { message: 'Item eliminado' };
  }

  async deleteCarrito(carritoId: number) {
    await this.itemRepo.delete({ carrito: { id_carrito: carritoId } as any });
    return { message: 'Carrito vaciado' };
  }

  /**
   * Sincroniza: reemplaza items del carrito por los provistos
   */
  async sincronizarCarrito(id_usuario: number, productos: { id: number; cantidad: number }[]) {
    let carrito = await this.getCarritoByUsuario(id_usuario);
    if (!carrito) {
      carrito = await this.createCarrito(id_usuario);
    }

    // eliminar items previos
    await this.itemRepo.delete({ carrito: { id_carrito: carrito.id_carrito } as any });

    const itemsToSave: CarritoItem[] = [];
    for (const p of productos) {
      const producto = await this.productoRepo.findOne({ where: { id_producto: p.id } });
      if (!producto) continue; // skip invalid product
      const item = this.itemRepo.create({
        carrito,
        producto,
        cantidad: p.cantidad,
      });
      itemsToSave.push(item);
    }

    const saved = await this.itemRepo.save(itemsToSave);
    carrito.items = saved;
    return carrito;
  }
}
