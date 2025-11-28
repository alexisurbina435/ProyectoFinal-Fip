import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, ValidateIf } from 'class-validator';
import { NivelRutina, TipoRutina } from '../entities/rutina.entity';

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
  @IsEnum(TipoRutina)
  tipo_rutina: TipoRutina;

  // id_usuario es requerido solo si tipo_rutina es 'cliente'
  @ValidateIf((o) => o.tipo_rutina === TipoRutina.CLIENTE)
  @IsNotEmpty()
  @IsInt()
  id_usuario?: number;
}
