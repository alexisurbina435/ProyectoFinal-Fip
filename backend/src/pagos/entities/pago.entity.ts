/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { Venta } from "../../venta/entities/venta.entity";

export enum MediosDePago {
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
  MERCADO_PAGO = 'MERCADO_PAGO'
}

export enum EstadoPago {
  COMPLETADO = 'COMPLETADO',
  PENDIENTE = 'PENDIENTE',
  FALLIDO = 'FALLIDO'
}

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MediosDePago,
    default: MediosDePago.TARJETA_DEBITO
  })
  medioDePago: MediosDePago;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | null): number | null =>
        value !== null ? Number(value) : null,
    },
  })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE
  })
  estado: EstadoPago;

  // Relaciones
  
  // FK a detalle_venta? Un pago para un detalle_venta? OneToOne?
  // @OneToOne(() => DetalleVenta, (detalleVenta) => detalleVenta.pago)
  // detalleVenta: DetalleVenta;
  // Lo normal es venta <-> detalle_venta OneToMany
  // Y venta <-> pago OneToMany
  @ManyToOne(() => Venta, (venta) => venta.pagos)
  venta: Venta;
}