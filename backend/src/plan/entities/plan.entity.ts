import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
export class Plan {
  @PrimaryGeneratedColumn({ name: 'id_plan', type: 'int' })
  id_plan: number;

  @Column({
    name: 'nombre',
    type: 'enum',
    enum: ['basic', 'standard', 'premium'],
    nullable: false,
  })
  nombre: 'basic' | 'standard' | 'premium';

  @Column({ name: 'precio', type: 'int', nullable: false })
  precio: number;

  @Column({ name: 'descripcion', type: 'varchar', length: 45, nullable: true })
  descripcion: string | null;

  @OneToMany(() => Usuario, (usuario) => usuario.plan)
  usuarios: Usuario[];

}