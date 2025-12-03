import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dificultad } from '../../dificultad/entities/dificultad.entity';

@Entity('ejercicio')
export class Ejercicio {
  @PrimaryGeneratedColumn()
  id_ejercicio: number;

  @Column({ type: 'varchar', length: 30 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  detalle: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grupo_muscular: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  video_url: string;

  @OneToMany(() => Dificultad, (dificultad) => dificultad.ejercicio)
  dificultades: Dificultad[];
}
