import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semana } from './entities/semana.entity';
import { SemanaDto } from './dto/semana.dto';
import { CreateSemanaDto } from './dto/create.semana.dto';
import { UpdateSemanaDto } from './dto/update.semana.dto';
import { Rutina } from '../rutina/entities/rutina.entity';
import { Dia } from '../dia/entities/dia.entity';

@Injectable()
export class SemanaService {
  constructor(
    @InjectRepository(Semana)
    private SemanaRepository: Repository<Semana>,

    @InjectRepository(Rutina)
    private readonly rutinaRepository: Repository<Rutina>,

    @InjectRepository(Dia)
    private readonly diaRepository: Repository<Dia>,
  ) {}

  async getAllSemana(): Promise<SemanaDto[]> {
    const semana: SemanaDto[] = await this.SemanaRepository.find();
    return semana;
  }

  async getSemanaById(id: number): Promise<SemanaDto | null> {
    const semana = await this.SemanaRepository.findOne({
      where: { id_semana: id },
    });

    return semana;
  }

  async postSemana(createSemanaDto: CreateSemanaDto): Promise<SemanaDto> {
    // Buscar la rutina para establecer la relación correctamente
    const rutina = await this.rutinaRepository.findOne({
      where: { id_rutina: createSemanaDto.id_rutina },
    });

    if (!rutina) {
      throw new NotFoundException(`Rutina con id ${createSemanaDto.id_rutina} no encontrada`);
    }

    // Crear semana con la relación a rutina
    const newSemana = this.SemanaRepository.create({
      numero_semana: createSemanaDto.numero_semana,
      rutina: rutina,
    });

    const semana = await this.SemanaRepository.save(newSemana);

    // Crear automáticamente el día 1 para la nueva semana
    const nuevoDia = this.diaRepository.create({
      numero_dia: 1,
      semana: semana,
    });
    await this.diaRepository.save(nuevoDia);

    return semana;
  }

  async putSemana(
    id: number,
    updateSemanaDto: UpdateSemanaDto,
  ): Promise<SemanaDto | null> {
    const semana = this.SemanaRepository.create(updateSemanaDto);
    const result = await this.SemanaRepository.update(
      { id_semana: id },
      semana,
    );
    if (!result.affected) {
      return null;
    }
    return await this.getSemanaById(id);
  }

  async deleteSemana(id_semana: number): Promise<boolean> {
    // Obtener la semana a eliminar para conocer su rutina
    const semanaAEliminar = await this.SemanaRepository.findOne({
      where: { id_semana },
      relations: ['rutina'],
    });

    if (!semanaAEliminar) {
      return false;
    }

    const id_rutina = semanaAEliminar.rutina.id_rutina;

    // Eliminar la semana
    const result = await this.SemanaRepository.delete({ id_semana });
    
    if ((result.affected ?? 0) > 0) {
      // Reordenar las semanas restantes de la rutina
      const semanasRestantes = await this.SemanaRepository.find({
        where: { rutina: { id_rutina } },
        order: { numero_semana: 'ASC' },
      });

      // Reasignar números de semana secuencialmente empezando desde 1
      for (let i = 0; i < semanasRestantes.length; i++) {
        const nuevoNumero = i + 1;
        if (semanasRestantes[i].numero_semana !== nuevoNumero) {
          await this.SemanaRepository.update(
            { id_semana: semanasRestantes[i].id_semana },
            { numero_semana: nuevoNumero }
          );
        }
      }
    }

    return (result.affected ?? 0) > 0;
  }
}
