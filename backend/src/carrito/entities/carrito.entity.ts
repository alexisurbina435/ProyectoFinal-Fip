import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CarritoItem } from './carrito-items.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('carritos')
export class Carrito {
  @PrimaryGeneratedColumn()
  id_carrito: number;

  @OneToOne(() => Usuario, usuario => usuario.carrito)
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;

  @OneToMany(() => CarritoItem, (item) => item.carrito, { cascade: true, eager: true })
  items: CarritoItem[];

  @CreateDateColumn({ type: 'datetime' })
  creado_en: Date;

  @Column({ type: 'datetime', nullable: true })
  actualizado_en: Date;
}
