import { IsInt, IsNotEmpty } from 'class-validator';

export class AddItemDto {
  @IsInt()
  productoId: number;

  @IsInt()
  cantidad: number;
}
