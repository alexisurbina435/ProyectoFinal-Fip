import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { Contacto } from './entities/contacto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactoService {

  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepo: Repository<Contacto>,
  ) { }


  async create(dto: CreateContactoDto): Promise<Contacto> {
    const contacto = this.contactoRepo.create(dto);
    return this.contactoRepo.save(contacto);
  }

  async findAll(): Promise<Contacto[]> {
    return this.contactoRepo.find();
  }

  async findOne(id: number): Promise<Contacto> {
    const contacto = await this.contactoRepo.findOne({ where: { id } });
    if (!contacto) {
      throw new NotFoundException(`Consulta con id ${id} no encontrado`);
    }
    return contacto;
  }

  async update(id: number, updateContactoDto: UpdateContactoDto): Promise<Contacto> {
    const contacto = await this.findOne(id);
    this.contactoRepo.merge(contacto, updateContactoDto);
    return this.contactoRepo.save(contacto);
  }

  async remove(id: number): Promise<Contacto> {
    const contacto = await this.findOne(id);
    return this.contactoRepo.remove(contacto);
  }
}
