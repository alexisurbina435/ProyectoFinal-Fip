import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column()
    email: string;

    @Column()
    telefono: number;

    @Column()
    direccion: string;

    @Column()
    password: string;

    @Column()
    estadoPago: boolean;

    @Column()
    FechaRegistro: Date;

    // faltan las relaciones 
}
