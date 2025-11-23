import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateContactoDto {

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre debe contener solo letras y espacios' })
    @Length(3, 30, { message: 'El nombre debe tener entre 3 y 30 caracteres' })
    nombre: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, { message: 'El correo no es válido' })
    @Length(5, 50, { message: 'El correo debe tener entre 5 y 50 caracteres' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 200, { message: 'La consulta debe tener entre 10 y 200 caracteres' })
    consulta: string;

}
