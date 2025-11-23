import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CreateDificultadDto {
  @Type(() => Number)
  @IsPositive()
  peso: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  repeticiones: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  diaId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ejercicioId: number;
}
