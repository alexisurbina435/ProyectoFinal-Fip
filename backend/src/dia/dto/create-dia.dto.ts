import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateDiaDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  numero_dia: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  id_semana: number;
}
