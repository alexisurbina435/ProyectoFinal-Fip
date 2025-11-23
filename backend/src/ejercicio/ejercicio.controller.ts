import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Param } from '@nestjs/common';
import { EjercicioService } from './ejercicio.service';
import { CreateEjercicioDto } from './dto/create.ejercico.dto';
import { UpdateEjercicioDto } from './dto/update.ejercicio.dto';
import { Ejercicio } from './entities/ejercicio.entity';

@Controller('ejercicio')
export class EjercicioController {
    constructor(private readonly ejercicioService: EjercicioService) { }

    @Post()
    async create(@Body() ejercicio: CreateEjercicioDto): Promise<Ejercicio> {
        try {
            return await this.ejercicioService.create(ejercicio);
        } catch (error) {
            throw new HttpException('Error al crear el ejercicio', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll(): Promise<Ejercicio[]> {
        return this.ejercicioService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Ejercicio> {
        return await this.ejercicioService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() ejercicio: UpdateEjercicioDto
    ): Promise<Ejercicio> {
        return await this.ejercicioService.update(id, ejercicio);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        await this.ejercicioService.remove(id);
    }
}
