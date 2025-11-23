import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semana } from './entities/semana.entity';
import { SemanaDto } from './dto/semana.dto';
import { CreateSemanaDto } from './dto/create.semana.dto';
import { UpdateSemanaDto } from './dto/update.semana.dto';

@Injectable()
export class SemanaService {
  constructor(
    @InjectRepository(Semana)
    private SemanaRepository: Repository<Semana>,
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
    const newSemana = this.SemanaRepository.create(createSemanaDto);
    const semana = await this.SemanaRepository.save(newSemana);
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
    const result = await this.SemanaRepository.delete({ id_semana });
    return (result.affected ?? 0) > 0;
  }
}
