import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
//import { Plan } from 'src/plan/entities/plan.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { DetalleVenta } from 'src/detalle_venta/entities/detalleVenta.entity';
import { Pago } from 'src/pagos/entities/pago.entity';

@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  // relacion de venta con usuario 
  @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
  @JoinColumn({ name: 'id_usuario' })//FK de usuario en venta
  usuario: Usuario;

 
  // lo comente por que pense que podriamos separar los productos de las subscripciones 
  //@ManyToOne(() => Plan, { nullable: true })
  //plan: Plan | null; // Si la venta es de un plan

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  //Relacion de venta con detallesVenta
  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalles: DetalleVenta[];

  //Relacion de venta con pagos
  @OneToMany(() => Pago, (pago) => pago.venta)
  pagos: Pago[];
}
