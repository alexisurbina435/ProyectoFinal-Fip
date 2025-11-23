import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateDetalleVentaDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    cantidad: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_venta: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id_producto: number

}