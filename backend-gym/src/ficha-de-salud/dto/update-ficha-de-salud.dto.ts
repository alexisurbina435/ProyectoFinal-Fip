import { PartialType } from '@nestjs/mapped-types';
import { CreateFichaDeSaludDto } from './create-ficha-de-salud.dto';

export class UpdateFichaDeSaludDto extends PartialType(CreateFichaDeSaludDto) {}
