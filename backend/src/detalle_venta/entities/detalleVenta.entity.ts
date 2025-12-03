import { Entity,PrimaryGeneratedColumn,Column,ManyToOne, JoinColumn, CreateDateColumn, } from "typeorm";
import { Venta } from "../../venta/entities/venta.entity";
import { Producto } from "../../productos/entities/producto.entity";

@Entity('detalle_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id_detalleVenta: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  @JoinColumn({ name: 'id_venta' })//FK de venta en detalle
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detalles)
  @JoinColumn({ name: 'id_producto' })//FK de producto en detalle
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'float' })
  subtotal: number; // producto.precio * cantidad

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}