import { Usuario } from "../../usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Sexo {
    MASCULINO = 'masculino',
    FEMENINO = 'femenino',
    OTRO = 'otro',
}

export enum TipoClase {
    PRESENCIAL = 'presencial',
    ONLINE = 'online',
    MIXTO = 'mixto',
}

export enum Confirmacion{
    SI = 'si',
    NO = 'no',
}

@Entity()
export class FichaSalud {

    @PrimaryGeneratedColumn()
    id_ficha: number;

    @Column({ type: 'int', unique: true })
    dni: number;

    @Column({ type: 'date' })
    fechaNacimiento: Date;

    @Column({ type: 'varchar', length: 50 })
    direccion: string;

    @Column({ type: 'varchar', length: 50 })
    ciudad: string;

    @Column({ type: 'varchar', length: 50 })
    provincia: string;

    @Column({ type: 'int' })
    codigoPostal: number;

    @Column({ type: 'varchar', length: 50 })
    pais: string;

    @Column({ type: 'enum', enum: Sexo })
    sexo: Sexo;

    @Column({ type: 'enum', enum: TipoClase })
    clase: TipoClase;

    @Column({ type: 'enum', enum: Confirmacion })
    condicion: Confirmacion;

    @Column({ type: 'varchar', nullable: true, length: 200 })
    lesion: string;

    @Column({ type: 'enum', enum: Confirmacion })
    medicacion: Confirmacion;

    @Column({ type: 'varchar', nullable: true, length: 200 })
    medicamento: string;

    @Column({ type: 'enum', enum: Confirmacion })
    expEntrenando: Confirmacion;

    @Column({ type: 'varchar', length: 200 })
    objetivos: string;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_creacion: Date

    //Relación one to one con usuario
    @OneToOne(() => Usuario, (usuario) => usuario.ficha,{cascade: true, onDelete: 'CASCADE'})
    // FK de usuario 
    @JoinColumn({name :'id_usuario'})
    usuario: Usuario

}
