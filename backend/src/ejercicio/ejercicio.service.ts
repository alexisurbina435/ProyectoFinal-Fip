import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejercicio } from './entities/ejercicio.entity';
import { CreateEjercicioDto } from './dto/create.ejercico.dto';
import { UpdateEjercicioDto } from './dto/update.ejercicio.dto';

@Injectable()
export class EjercicioService {
    constructor(
        @InjectRepository(Ejercicio)
        private readonly ejercicioRepo: Repository<Ejercicio>,
    ) { }

    async create(ejercicio: CreateEjercicioDto): Promise<Ejercicio> {
        const newEjercicio = this.ejercicioRepo.create(ejercicio);
        return this.ejercicioRepo.save(newEjercicio);
    }

    async findAll(): Promise<Ejercicio[]> {
        return this.ejercicioRepo.find();
    }

    async findOne(id: number): Promise<Ejercicio> {
        const ejercicio = await this.ejercicioRepo.findOne({ where: { id_ejercicio: id } });
        if (!ejercicio) {
            throw new NotFoundException(`Ejercicio con id ${id} no encontrado`);
        }
        return ejercicio;
    }

    async remove(id: number): Promise<void> {
        const ejercicio = await this.findOne(id);
        await this.ejercicioRepo.remove(ejercicio);
    }

    async update(id: number, ejercicio: UpdateEjercicioDto): Promise<Ejercicio> {
        const existingEjercicio = await this.findOne(id);
        this.ejercicioRepo.merge(existingEjercicio, ejercicio);
        return this.ejercicioRepo.save(existingEjercicio);
    }
}
