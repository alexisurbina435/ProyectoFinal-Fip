import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { NivelRutina, TipoRutina } from '../entities/rutina.entity';

class CreateSemanaCompletaDto {
  @IsNotEmpty()
  @IsInt()
  numero_semana: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiaCompletoDto)
  dias: CreateDiaCompletoDto[];
}

class CreateDiaCompletoDto {
  @IsNotEmpty()
  @IsInt()
  numero_dia: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDificultadCompletaDto)
  ejercicios: CreateDificultadCompletaDto[];
}

class CreateDificultadCompletaDto {
  @IsNotEmpty()
  @IsInt()
  ejercicioId: number;

  @IsNotEmpty()
  @IsInt()
  series: number;

  @IsNotEmpty()
  @IsInt()
  repeticiones: number;

  @IsOptional()
  @IsInt()
  peso?: number;
}

export class CreateRutinaCompletaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsEnum(NivelRutina)
  nivel: NivelRutina;

  @IsNotEmpty()
  @IsEnum(TipoRutina)
  tipo_rutina: TipoRutina;

  @ValidateIf((o) => o.tipo_rutina === TipoRutina.PLAN)
  @IsNotEmpty()
  @IsString()
  categoria?: string;

  @ValidateIf((o) => o.tipo_rutina === TipoRutina.CLIENTE)
  @IsNotEmpty()
  @IsInt()
  id_usuario?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSemanaCompletaDto)
  semanas: CreateSemanaCompletaDto[];
}

