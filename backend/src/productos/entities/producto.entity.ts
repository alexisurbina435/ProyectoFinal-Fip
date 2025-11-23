import { DetalleVenta } from 'src/detalle_venta/entities/detalleVenta.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ type: 'varchar', length: 30 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen: string;

  @Column({ type: 'float' })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  categoria: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha_creacion: Date;

  // Relacion con tabla intermedia => detalleVenta
  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.producto)
  detalles: DetalleVenta[];
}
