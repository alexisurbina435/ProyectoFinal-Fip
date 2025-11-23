import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ejercicio } from "src/ejercicio/entities/ejercicio.entity";
import { Dia } from "src/dia/entities/dia.entity";

@Entity('dificultad')
export class Dificultad {

  @PrimaryGeneratedColumn()
  id_dificultad: number;

  @Column({ type: 'int' })
  peso: number;

  @Column({ type: 'int' })
  repeticiones: number;


  // ELIMINAR EN CASCADA SI O NO?
  @ManyToOne(() => Dia, dia => dia.dificultades, { onDelete: 'CASCADE' })
  dia: Dia;

  @ManyToOne(() => Ejercicio, ejercicio => ejercicio.dificultades, {
    onDelete: 'CASCADE',
  })
  ejercicio: Ejercicio;
}