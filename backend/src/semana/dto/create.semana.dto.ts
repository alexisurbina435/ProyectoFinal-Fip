import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateSemanaDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  numero_semana: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id_rutina: number;
}
