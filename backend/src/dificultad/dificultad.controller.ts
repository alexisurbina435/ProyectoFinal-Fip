import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DificultadService } from './dificultad.service';
import { CreateDificultadDto } from './dto/create-dificultad.dto';
import { UpdateDificultadDto } from './dto/update-dificultad.dto';
import { Dificultad } from './entities/dificultad.entity';

@Controller('dificultad')
export class DificultadController {
  constructor(private readonly dificultadService: DificultadService) {}

  @Post()
  async create(
    @Body() createDificultadDto: CreateDificultadDto,
  ): Promise<Dificultad> {
    return this.dificultadService.create(createDificultadDto);
  }

  @Get()
  async findAll(): Promise<Dificultad[]> {
    return this.dificultadService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Dificultad> {
    return this.dificultadService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDificultadDto: UpdateDificultadDto,
  ): Promise<Dificultad> {
    return this.dificultadService.update(id, updateDificultadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.dificultadService.remove(id);
  }
}
