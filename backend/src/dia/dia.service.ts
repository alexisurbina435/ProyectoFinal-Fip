import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaDto } from './dto/create-dia.dto';
import { UpdateDiaDto } from './dto/update-dia.dto';
import { Dia } from './entities/dia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Semana } from 'src/semana/entities/semana.entity';

@Injectable()
export class DiaService {
  constructor(
    @InjectRepository(Dia)
    private readonly diaRepo: Repository<Dia>,

    @InjectRepository(Semana)
    private readonly semanaRepository: Repository<Semana>,
  ) {}

  async create(createDiaDto: CreateDiaDto) {
    const semana = await this.semanaRepository.findOne({
      where: { id_semana: createDiaDto.id_semana },
    });

    if (!semana) {
      throw new NotFoundException('Semana no encontrada');
    }
    const dia = await this.diaRepo.create({
      numero_dia: createDiaDto.numero_dia,
      semana: semana,
    });
    return await this.diaRepo.save(dia);
  }

  async findAll(): Promise<Dia[]> {
    return this.diaRepo.find();
  }

  async findOne(id: number): Promise<Dia> {
    const dia = await this.diaRepo.findOne({ where: { id_dia: id } });
    if (!dia) {
      throw new NotFoundException(`Dia con id ${id} no encontrado`);
    }
    return dia;
  }

  async update(id: number, updateDiaDto: UpdateDiaDto): Promise<Dia> {
    const existingDia = await this.findOne(id);
    this.diaRepo.merge(existingDia, updateDiaDto);
    return this.diaRepo.save(existingDia);
  }

  async remove(id: number): Promise<void> {
    const dia = await this.findOne(id);
    await this.diaRepo.remove(dia);
  }
}
