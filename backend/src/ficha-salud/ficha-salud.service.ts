import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFichaSaludDto } from './dto/create-ficha-salud.dto';
import { UpdateFichaSaludDto } from './dto/update-ficha-salud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichaSalud } from './entities/ficha-salud.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class FichaSaludService {

  constructor(
    @InjectRepository(FichaSalud)
    private readonly fichaSaludRepo: Repository<FichaSalud>,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }
  async create(fichaDto: CreateFichaSaludDto): Promise<FichaSalud> {
    const usuario = await this.usuarioRepository.findOneBy({ id_usuario: fichaDto.id_usuario });
    if (!usuario) {
      throw new NotFoundException(`El usuario con ${fichaDto.id_usuario} no existe`);
    }
    const fichaSalud = this.fichaSaludRepo.create({...fichaDto, usuario});
    return this.fichaSaludRepo.save(fichaSalud);
  }

  async findAll(): Promise<FichaSalud[]> {
    return this.fichaSaludRepo.find({relations: ['usuario'] });
  }

  async findOne(id: number): Promise<FichaSalud> {
    const ficha = await this.fichaSaludRepo.findOne({ where: { id_ficha: id }, relations: ['usuario'] });
    if(!ficha) {
      throw new NotFoundException(`Ficha con id ${id} no encontrada`);
    }
    return ficha;
  }

  async update(id: number, updateFichaSaludDto: UpdateFichaSaludDto): Promise<FichaSalud> {
    const ficha = await this.findOne(id);
    if(!ficha) {
      throw new NotFoundException(`Ficha con id ${id} no encontrada`);
    }
    this.fichaSaludRepo.merge(ficha, updateFichaSaludDto);
    return this.fichaSaludRepo.save(ficha);
  }

  async remove(id: number): Promise<FichaSalud> {
    const ficha = await this.findOne(id);
    if(!ficha) {
      throw new NotFoundException(`Ficha con id ${id} no encontrada`);
    }
    return this.fichaSaludRepo.remove(ficha);
  }
}
