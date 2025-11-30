import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Carrito } from './carrito.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('carrito_items')
export class CarritoItem {
  @PrimaryGeneratedColumn()
  id_item: number;

  @ManyToOne(() => Carrito, (carrito) => carrito.items, { onDelete: 'CASCADE' })
  carrito: Carrito;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id_producto' })
  producto: Producto;

  @Column('int')
  cantidad: number;
}
