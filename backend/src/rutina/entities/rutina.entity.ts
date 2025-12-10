import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
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

  // NOTA: La relación con Usuario se maneja solo desde Usuario.rutina_activa
  // Esto permite que una rutina sea compartida por múltiples usuarios
  // y que las rutinas sobrevivan si se elimina un usuario

  @OneToMany(() => Semana, (semana) => semana.rutina, { cascade: true })
  semanas: Semana[];
}
