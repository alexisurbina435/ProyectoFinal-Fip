
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Sexo {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO',
}

export enum TipoDeClase {
  PRESENCIAL = 'PRESENCIAL',
  ONLINE = 'ONLINE',
  MIXTO = 'MIXTO',
}

@Entity("ficha-de-salud")
export class FichaDeSalud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    condicion_medica: boolean;

    @Column()
    antecedentes_medicos: string;

    @Column()
    consumo_medicacion: boolean;

    @Column()
    medicacion: string;

    @Column()
    exp_entrenando: boolean;

    @Column()
    objetivos: string;

    @Column()
    fecha: Date;

    @Column()
    edad: number;

    @Column()
    dni: number;

    @Column()
    fecha_nacimiento: Date;

    @Column()
    direccion: string;

    @Column()
    ciudad: string;

    @Column()
    provincia: string;

    @Column()
    codigo_postal: number;
    
    @Column()
    pais: string;

    @Column()
    sexo: Sexo;

    @Column()
    tipo_clase: TipoDeClase;
}
