import { IsInt } from 'class-validator';

export class UpdateItemDto {
  @IsInt()
  cantidad: number;
}
