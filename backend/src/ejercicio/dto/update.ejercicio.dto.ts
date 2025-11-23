import { PartialType } from '@nestjs/mapped-types';
import { CreateEjercicioDto } from './create.ejercico.dto';

export class UpdateEjercicioDto extends PartialType(CreateEjercicioDto) {}
