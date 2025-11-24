import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateSuscripcionDto {
  @IsInt()
  @IsPositive()
  id_usuario: number;

  @IsInt()
  @IsPositive()
  id_plan: number;

  @IsInt()
  @IsPositive()
  mesesContratados: number;
}
