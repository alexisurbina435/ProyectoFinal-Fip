import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { FichaSaludService } from './ficha-salud.service';
import { CreateFichaSaludDto } from './dto/create-ficha-salud.dto';
import { UpdateFichaSaludDto } from './dto/update-ficha-salud.dto';
import { FichaSalud } from './entities/ficha-salud.entity';

@Controller('ficha-salud')
export class FichaSaludController {
  constructor(private readonly fichaSaludService: FichaSaludService) {}

  @Post()
  async create(@Body() createFichaSaludDto: CreateFichaSaludDto): Promise<FichaSalud> {
    try{
      return await this.fichaSaludService.create(createFichaSaludDto);
    }catch(error){
      throw new HttpException('Error al crear la ficha de salud', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<FichaSalud[]> {
    try{
      return this.fichaSaludService.findAll();
    }catch(error){
      throw new HttpException('Error al obtener las fichas de salud', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FichaSalud> {
    try{
      return this.fichaSaludService.findOne(+id);
    }catch(error){
      throw new HttpException('Error al obtener la ficha de salud', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFichaSaludDto: UpdateFichaSaludDto): Promise<FichaSalud> {
    try{
      return this.fichaSaludService.update(+id, updateFichaSaludDto);
    }catch(error){
      throw new HttpException('Error al actualizar la ficha de salud', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<FichaSalud> {
    try{
      return this.fichaSaludService.remove(+id);
    }catch(error){
      throw new HttpException('Error al eliminar la ficha de salud', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
