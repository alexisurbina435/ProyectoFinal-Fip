import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBlogDto {
  @IsOptional()
  @IsString()
  imagen?: string | null;

  @IsOptional()
  @IsString()
  categoria?: string | null;

  @IsString()
  @MinLength(1)
  titulo: string;

  @IsString()
  @MinLength(1)
  glosario: string;

  @IsString()
  @MinLength(1)
  contenido: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_usuario: number;
}