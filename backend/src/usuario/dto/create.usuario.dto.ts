import { Unique } from 'typeorm';
import { Rol } from '../entities/usuario.entity';
import { tipoPlan } from '../entities/usuario.entity';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FichaSalud } from '../../ficha-salud/entities/ficha-salud.entity';

export class CreateUsuarioDto {

  @IsNotEmpty({message: 'El nombre es requerido'})
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre debe contener solo letras y espacios' })
  nombre: string;

  @IsNotEmpty({message: 'El apellido es requerido'})
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido debe contener solo letras y espacios' })
  apellido: string;

  @IsNotEmpty({message: 'El email es requerido'})
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, {
    message: 'El correo no es válido',
  })
  email: string;

  @IsNotEmpty({message: 'El teléfono es requerido'})
  // @IsPhoneNumber('AR', { message: 'El número de teléfono no es válido' })
  @Matches(/^(\+54\s?)?\d{3,4}\s?\d{6}$/, { message: 'El número de teléfono no es válido' })
  @IsString()
  telefono: string;

  @IsNotEmpty({message: 'La password es requerida'})
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password)
  @Equals('password', { message: 'Las contraseñas no coinciden' })
  confirmPassword?: string;

  @IsOptional()
  @ValidateNested()
  ficha?: FichaSalud;

  @IsEnum(Rol)
  rol: Rol;
  
  @IsBoolean()
  estado_pago: boolean;

  @IsOptional()
  @IsBoolean()
  aceptarEmails: boolean;

  @IsOptional()
  @IsBoolean()
  aceptarWpp: boolean;

  @IsBoolean()
  @IsNotEmpty({message: 'El aceptar Terminos es requerido'})
  aceptarTerminos: boolean;
  
  @IsOptional()
  @IsInt()
  rutina_activa_id?: number;

}
