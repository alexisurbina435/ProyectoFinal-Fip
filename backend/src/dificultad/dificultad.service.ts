import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDificultadDto } from './dto/create-dificultad.dto';
import { UpdateDificultadDto } from './dto/update-dificultad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dificultad } from './entities/dificultad.entity';
import { Dia } from '../dia/entities/dia.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';

@Injectable()
export class DificultadService {
  constructor(
    @InjectRepository(Dificultad)
    private readonly dificultadRepository: Repository<Dificultad>,
    @InjectRepository(Dia)
    private readonly diaRepository: Repository<Dia>,
    @InjectRepository(Ejercicio)
    private readonly ejercicioRepository: Repository<Ejercicio>,
  ) {}

  async create(createDificultadDto: CreateDificultadDto): Promise<Dificultad> {
    const { diaId, ejercicioId, peso, repeticiones, series } = createDificultadDto;

    const dia = await this.findDia(diaId);
    const ejercicio = await this.findEjercicio(ejercicioId);

    const dificultad = this.dificultadRepository.create({
      peso,
      repeticiones,
      series,
      dia,
      ejercicio,
    });

    try {
      return await this.dificultadRepository.save(dificultad);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Dificultad[]> {
    return this.dificultadRepository.find({
      relations: ['dia', 'ejercicio'],
      order: { id_dificultad: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Dificultad> {
    const dificultad = await this.dificultadRepository.findOne({
      where: { id_dificultad: id },
      relations: ['dia', 'ejercicio'],
    });

    if (!dificultad) {
      throw new NotFoundException(`Dificultad con id ${id} no encontrada`);
    }

    return dificultad;
  }

  async update(
    id: number,
    updateDificultadDto: UpdateDificultadDto,
  ): Promise<Dificultad> {
    const dificultad = await this.findOne(id);

    if (updateDificultadDto.diaId !== undefined) {
      dificultad.dia = await this.findDia(updateDificultadDto.diaId);
    }

    if (updateDificultadDto.ejercicioId !== undefined) {
      dificultad.ejercicio = await this.findEjercicio(
        updateDificultadDto.ejercicioId,
      );
    }

    if (updateDificultadDto.peso !== undefined) {
      dificultad.peso = updateDificultadDto.peso;
    }

    if (updateDificultadDto.repeticiones !== undefined) {
      dificultad.repeticiones = updateDificultadDto.repeticiones;
    }

    if (updateDificultadDto.series !== undefined) {
      dificultad.series = updateDificultadDto.series;
    }

    try {
      return await this.dificultadRepository.save(dificultad);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.dificultadRepository.delete({ id_dificultad: id });
    if (!result.affected) {
      throw new NotFoundException(`Dificultad con id ${id} no encontrada`);
    }
  }

  private async findDia(id: number): Promise<Dia> {
    const dia = await this.diaRepository.findOne({ where: { id_dia: id } });
    if (!dia) {
      throw new NotFoundException(`Dia con id ${id} no encontrado`);
    }
    return dia;
  }

  private async findEjercicio(id: number): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findOne({
      where: { id_ejercicio: id },
    });
    if (!ejercicio) {
      throw new NotFoundException(`Ejercicio con id ${id} no encontrado`);
    }
    return ejercicio;
  }
}
