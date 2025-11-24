import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NivelRutina } from '../entities/rutina.entity';

export class CreateRutinaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsEnum(NivelRutina)
  nivel: NivelRutina;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsNotEmpty()
  id_usuario: number;
}
