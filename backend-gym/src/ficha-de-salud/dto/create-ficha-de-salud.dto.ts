import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Sexo, TipoDeClase } from "../entities/ficha-de-salud.entity";

export class CreateFichaDeSaludDto {
    @IsBoolean()
    @IsNotEmpty()
    condicion_medica: boolean

    @IsString()
    antecedentes_medicos: string;
    
    @IsBoolean()
    @IsNotEmpty()
    consumo_medicacion: boolean;

    @IsString()
    medicacion: string;

    @IsBoolean()
    @IsNotEmpty()
    exp_entrenando: boolean;

    @IsString()
    @IsNotEmpty()
    objetivos: string;

    @IsDate()
    @IsNotEmpty()
    fecha: Date;

    @IsNumber()
    @IsNotEmpty()
    edad: number;

    @IsNumber()
    @IsNotEmpty()
    dni: number;

    @IsDate()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    ciudad: string;

    @IsString()
    @IsNotEmpty()
    provincia: string;

    @IsNumber()
    @IsNotEmpty()
    codigo_postal: number;

    @IsString()
    @IsNotEmpty()
    pais: string;   

    @IsEnum(Sexo)
    @IsNotEmpty()
    sexo: Sexo;

    @IsEnum(TipoDeClase)
    @IsNotEmpty()
    tipo_de_clase: TipoDeClase;
}
