import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("contacto")
export class Contacto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 30})
    nombre: string;

    @Column({type: 'varchar', length: 50})
    email: string;

    @Column({type: 'varchar', length: 200})
    consulta: string;

    @CreateDateColumn({type: 'datetime'})
    fecha_creacion: Date;
}
