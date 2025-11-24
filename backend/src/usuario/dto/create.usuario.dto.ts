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
import { FichaSalud } from 'src/ficha-salud/entities/ficha-salud.entity';

export class CreateUsuarioDto {

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, {
    message: 'El correo no es válido',
  })
  email: string;

  @IsNotEmpty()
  // @IsPhoneNumber('AR', { message: 'El número de teléfono no es válido' })
  @Matches(/^(\+54\s?)?\d{3,4}\s?\d{6}$/, { message: 'El número de teléfono no es válido' })
  @IsString()
  telefono: string;

  @IsNotEmpty()
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
  // tipoPlan: tipoPlan;
  @IsBoolean()
  estado_pago: boolean;
  // @IsInt()
  // @IsOptional()
  // id_plan?: number; // FK hacia Plan

}
