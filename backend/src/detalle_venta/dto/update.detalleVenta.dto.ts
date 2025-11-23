import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleVentaDto } from './create.detalleVenta.dto';

export class UpdateDetalleVentaDto extends PartialType(CreateDetalleVentaDto) {}
