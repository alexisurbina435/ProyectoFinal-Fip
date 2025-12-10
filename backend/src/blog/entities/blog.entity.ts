import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id_blog: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoria: string | null;

  @Column({ type: 'varchar', length: 50 })
  titulo: string;

  @Column({ type: 'varchar', length: 100 })
  glosario: string;

  @Column({ type: 'text' })
  contenido: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha_publicacion: Date;

  // @ManyToOne(() => Usuario, (usuario) => usuario.blogs, { nullable: false })
  // usuario: Usuario;
}