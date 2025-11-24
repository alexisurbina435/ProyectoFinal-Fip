import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Rutina } from 'src/rutina/entities/rutina.entity';
import { Dia } from 'src/dia/entities/dia.entity';

@Entity('semana')
export class Semana {
  @PrimaryGeneratedColumn()
  id_semana: number;

  @Column({ type: 'int' })
  numero_semana: number;

  @ManyToOne(() => Rutina, (rutina) => rutina.semanas, {
    onDelete: 'CASCADE',
  })
  rutina: Rutina;

  @OneToMany(() => Dia, (dia) => dia.semana, {
    onDelete: 'CASCADE',
  })
  dias: Dia[];
}
