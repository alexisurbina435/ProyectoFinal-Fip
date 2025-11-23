import { PartialType } from '@nestjs/mapped-types';
import { CreateDificultadDto } from './create-dificultad.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateDificultadDto extends PartialType(CreateDificultadDto) {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  peso?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  repeticiones?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  diaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ejercicioId?: number;
}