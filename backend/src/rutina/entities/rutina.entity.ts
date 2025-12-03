import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Semana } from '../../semana/entities/semana.entity';

export enum NivelRutina {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  PERSONALIZADO = 'personalizado',
}

export enum TipoRutina {
  CLIENTE = 'cliente',      // Rutina para un cliente específico
  PLAN = 'plan',           // Rutina ligada a un tipo de plan
  GENERAL = 'general',     // Rutina general (plantilla)
}

@Entity('rutina')
export class Rutina {
  @PrimaryGeneratedColumn()
  id_rutina: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ length: 255 })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: NivelRutina,
    nullable: false,
  })
  nivel: NivelRutina;

  @Column({
    type: 'enum',
    enum: ['Basic', 'Medium', 'Premium'],
    nullable: true,
  })
  categoria: string;

  @Column({
    type: 'enum',
    enum: TipoRutina,
    default: TipoRutina.CLIENTE,
    nullable: false,
  })
  tipo_rutina: TipoRutina;

  // RELACIÓN → Muchas Rutinas pertenecen a un Usuario (opcional para rutinas generales)
  @ManyToOne(() => Usuario, (usuario) => usuario.rutinas, {
    onDelete: 'CASCADE',
    nullable: true, // Ahora es opcional para permitir rutinas generales
  })
  @JoinColumn({ name: 'usuarioIdUsuario' })
  usuario?: Usuario;

  @OneToMany(() => Semana, (semana) => semana.rutina, { cascade: true })
  semanas: Semana[];
}
