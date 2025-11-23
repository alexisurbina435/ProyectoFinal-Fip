import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreatePagoDto } from './create.pago.dto';
import { EstadoPago, MediosDePago } from '../entities/pago.entity';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {
  @IsOptional()
  @IsEnum(MediosDePago)
  medioDePago?: MediosDePago;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  monto?: number;

  @IsOptional()
  @IsEnum(EstadoPago)
  estado?: EstadoPago;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ventaId?: number;
}