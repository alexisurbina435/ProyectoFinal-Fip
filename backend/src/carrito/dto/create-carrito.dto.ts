import { IsInt, IsOptional } from 'class-validator';

export class CreateCarritoDto {
  @IsOptional()
  @IsInt()
  id_usuario?: number; 
}
