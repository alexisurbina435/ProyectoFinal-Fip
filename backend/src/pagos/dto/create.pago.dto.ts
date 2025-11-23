import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { MediosDePago, EstadoPago } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsEnum(MediosDePago)
  @IsNotEmpty()
  medioDePago: MediosDePago;

  @Type(() => Number)
  @IsPositive()
  monto: number;

  @IsOptional()
  @IsEnum(EstadoPago)
  estado?: EstadoPago;

  // Relacion con venta
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ventaId: number;
}