import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, ValidateIf } from "class-validator";
import { Confirmacion, Sexo, TipoClase } from "../entities/ficha-salud.entity";
import { Unique } from "typeorm";
import { Type } from "class-transformer";

export class CreateFichaSaludDto {

        @Type(() => Number)
        @IsNumber()
        @IsNotEmpty()
        @IsPositive()
        dni: number;

        @IsNotEmpty()
        @IsDate()
        @Type(() => Date)
        fechaNacimiento: Date;

        @IsNotEmpty()
        @IsString()
        @Length(3, 50, { message: 'La direccion debe tener entre 5 y 50 caracteres' })
        direccion: string;

        @IsNotEmpty()
        @IsString()
        @Length(3, 50, { message: 'La ciudad debe tener entre 5 y 50 caracteres' })
        ciudad: string;

        @IsNotEmpty()
        @IsString()
        @Length(3, 50, { message: 'La provincia debe tener entre 5 y 50 caracteres' })
        provincia: string;

        @Type(() => Number)
        @IsNumber()
        @IsNotEmpty()
        @IsPositive()
        codigoPostal: number;

        @IsNotEmpty()
        @IsString()
        @Length(3, 50, { message: 'El pais debe tener entre 5 y 50 caracteres' })
        pais: string;

        @IsNotEmpty()
        @IsEnum(Sexo)
        sexo: Sexo;

        @IsNotEmpty()
        @IsEnum(TipoClase)
        clase: TipoClase;

        // @Type(() => Boolean)
        // @IsBoolean()
        @IsEnum(Confirmacion)
        @IsNotEmpty()
        condicion: Confirmacion;

        @IsString()
        @IsOptional()
        lesion: string;

        // @Type(() => Boolean)
        // @IsBoolean()
        @IsEnum(Confirmacion)
        @IsNotEmpty()
        medicacion: Confirmacion;

        @IsString()
        @IsOptional()
        // @Length(10, 200, { message: 'El medicamento debe tener entre 2 y 200 caracteres' })
        medicamento: string;

        // @Type(() => Boolean)
        // @IsBoolean()
        @IsEnum(Confirmacion)
        @IsNotEmpty()
        expEntrenando: Confirmacion;

        @IsNotEmpty()
        @IsString()
        @Length(10, 200, { message: 'El objetivo debe tener entre 2 y 200 caracteres' })
        objetivos: string;
        
        // el id del usuario va a ser unico por planilla 
        @IsNumber()
        @Unique(['id_usuario'])
        id_usuario: number;
}
