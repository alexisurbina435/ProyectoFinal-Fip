import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rutina } from 'src/rutina/entities/rutina.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { FichaSalud } from 'src/ficha-salud/entities/ficha-salud.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Suscripcion } from 'src/suscripcion/entities/suscripcion.entity';

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

  @Column({ type: 'varchar', length: 255, unique: true})
  email: string;

  @Column({ type: 'varchar', length: 20})
  telefono: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.USUARIO })
  rol: Rol;

  // @Column({ type: 'enum', enum: tipoPlan, nullable: true })
  // tipoPlan: tipoPlan;

  @Column({ type: 'boolean', default: false })
  estado_pago: boolean;

  // @ManyToOne(() => Plan, (plan) => plan.usuarios, { nullable: true })
  // @JoinColumn({ name: 'id_plan' }) // FK en la tabla usuario
  // plan?: Plan;


  //Relación one to one con fichaSalud
  // la ficha es opcional, por que depende de que se inscriba a un plan el usuario
  @OneToOne(() => FichaSalud, (ficha) => ficha.usuario)
  ficha?: FichaSalud;

  // RELACIÓN → Un usuario puede tener muchas rutinas
  @OneToMany(() => Rutina, (rutina) => rutina.usuario, {
    cascade: true,
  })
  rutinas: Rutina[];

  // Un usuario puede tener muchas ventas
  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  // Un usuario puede tener muchos blogs
  @OneToMany(() => Blog, (blog) => blog.usuario)
  blogs: Blog[];

  @OneToMany(() => Suscripcion, (suscripcion) => suscripcion.usuario)
  suscripciones: Suscripcion[];

}
