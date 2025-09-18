import { Injectable } from '@nestjs/common';
import { CreateFichaDeSaludDto } from './dto/create-ficha-de-salud.dto';
import { UpdateFichaDeSaludDto } from './dto/update-ficha-de-salud.dto';

@Injectable()
export class FichaDeSaludService {
  create(createFichaDeSaludDto: CreateFichaDeSaludDto) {
    return 'This action adds a new fichaDeSalud';
  }

  findAll() {
    return `This action returns all fichaDeSalud`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fichaDeSalud`;
  }

  update(id: number, updateFichaDeSaludDto: UpdateFichaDeSaludDto) {
    return `This action updates a #${id} fichaDeSalud`;
  }

  remove(id: number) {
    return `This action removes a #${id} fichaDeSalud`;
  }
}
