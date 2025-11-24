import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Semana } from 'src/semana/entities/semana.entity';
import { Dificultad } from '../../dificultad/entities/dificultad.entity';

@Entity('dia')
export class Dia {
  @PrimaryGeneratedColumn()
  id_dia: number;

  @Column({ type: 'int' })
  numero_dia: number;

  // RELACIÓN → Muchos días pertenecen a una semana
  @ManyToOne(() => Semana, (semana) => semana.dias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_semana' })
  semana: Semana;

  // RELACIÓN → Un día tiene muchas dificultades
  @OneToMany(() => Dificultad, (dificultad) => dificultad.dia, {
    cascade: true,
  })
  dificultades: Dificultad[];
}
