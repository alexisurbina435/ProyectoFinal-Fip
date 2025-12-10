import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaDto } from './dto/create-dia.dto';
import { UpdateDiaDto } from './dto/update-dia.dto';
import { Dia } from './entities/dia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Semana } from '../semana/entities/semana.entity';

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
    const dia = await this.diaRepo.findOne({ 
      where: { id_dia: id },
      relations: ['semana']
    });
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
    // Obtener el día a eliminar para conocer su semana
    const diaAEliminar = await this.findOne(id);
    
    if (!diaAEliminar) {
      throw new NotFoundException(`Día con id ${id} no encontrado`);
    }

    const id_semana = diaAEliminar.semana.id_semana;

    // Eliminar el día
    await this.diaRepo.remove(diaAEliminar);

    // Reordenar los días restantes de la semana
    const diasRestantes = await this.diaRepo.find({
      where: { semana: { id_semana } },
      order: { numero_dia: 'ASC' },
    });

    // Reasignar números de día secuencialmente empezando desde 1
    for (let i = 0; i < diasRestantes.length; i++) {
      const nuevoNumero = i + 1;
      if (diasRestantes[i].numero_dia !== nuevoNumero) {
        await this.diaRepo.update(
          { id_dia: diasRestantes[i].id_dia },
          { numero_dia: nuevoNumero }
        );
      }
    }
  }
}
