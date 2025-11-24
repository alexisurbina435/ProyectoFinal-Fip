import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Semana } from 'src/semana/entities/semana.entity';

export enum NivelRutina {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  PERSONALIZADO = 'personalizado',
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

  // RELACIÓN → Muchas Rutinas pertenecen a un Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.rutinas, {
    onDelete: 'CASCADE',
    nullable: false,
  }) // nullable false hace que una rutina si o si debe estar asociadada a un usuario
  @JoinColumn({ name: 'usuarioIdUsuario' })
  usuario: Usuario;

  @OneToMany(() => Semana, (semana) => semana.rutina, { cascade: true })
  semanas: Semana[];
}
