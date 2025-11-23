
import { IsInt, IsNotEmpty } from "class-validator";


export class CreateVentaDto {

    @IsNotEmpty()
    @IsInt()
    id_usuario: number

}
