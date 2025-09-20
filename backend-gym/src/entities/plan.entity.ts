/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PlanType {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  BASIC = 'BASIC'
}

@Entity('plan')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.BASIC
  })
  type: PlanType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  duracionEnDias: number;

  // Relaciones

  //FK id_productos
  //@OneToOne(() => Producto, (producto) => producto.plan)
  //@JoinColumn({ name: 'id_productos' })
  //producto: Producto; 
  
}