import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDiaDto {
  @IsInt()
  @IsNotEmpty()
  cant_dias: number;
  @IsInt()
  @IsNotEmpty()
  id_semana: number;
}
