import { PartialType } from '@nestjs/mapped-types';
import { CreateFichaSaludDto } from './create-ficha-salud.dto';

export class UpdateFichaSaludDto extends PartialType(CreateFichaSaludDto) {}
