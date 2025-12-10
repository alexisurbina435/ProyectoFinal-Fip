import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rutina } from '../../rutina/entities/rutina.entity';
import { Venta } from '../../venta/entities/venta.entity';
import { Blog } from '../../blog/entities/blog.entity';
import { FichaSalud } from '../../ficha-salud/entities/ficha-salud.entity';
import { Suscripcion } from '../../suscripcion/entities/suscripcion.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';

export enum Rol {
  USUARIO = 'usuario',
  ADMIN = 'admin',
}

export enum tipoPlan {
  BASIC = 'Basic',
  MEDIUM = 'Medium',
  PREMIUM = 'Premium',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 45 })
  nombre: string;

  @Column({ type: 'varchar', length: 45 })
  apellido: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.USUARIO })
  rol: Rol;

  @Column({ type: 'boolean', default: false })
  estado_pago: boolean;

  @Column({type: 'boolean', default: false })
  aceptarEmails: boolean;

  @Column({type: 'boolean', default: false })
  aceptarWpp: boolean;

  @Column()
  aceptarTerminos: boolean;

  //Relación one to one con fichaSalud
  // la ficha es opcional, por que depende de que se inscriba a un plan el usuario
  @OneToOne(() => FichaSalud, (ficha) => ficha.usuario)
  ficha?: FichaSalud;

  // RELACIÓN → Un usuario tiene una rutina activa (nullable)
  // Esta es la única relación necesaria. Una rutina puede ser compartida por múltiples usuarios
  @ManyToOne(() => Rutina, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rutina_activa_id' })
  rutina_activa?: Rutina;

  // Un usuario puede tener muchas ventas
  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  // Un usuario puede tener muchos blogs
  @OneToMany(() => Blog, 'usuario')
  blogs: Blog[];

  @OneToMany(() => Suscripcion, (suscripcion) => suscripcion.usuario)
  suscripciones: Suscripcion[];

  @OneToOne(() => Carrito, carrito => carrito.usuario)
  carrito: Carrito;
}
