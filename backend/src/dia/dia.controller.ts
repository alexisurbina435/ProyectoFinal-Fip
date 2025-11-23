import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { DiaService } from './dia.service';
import { CreateDiaDto } from './dto/create-dia.dto';
import { UpdateDiaDto } from './dto/update-dia.dto';
import { Dia } from './entities/dia.entity';

@Controller('dia')
export class DiaController {
  constructor(private readonly diaService: DiaService) {}

  @Post()
  async create(@Body() createDiaDto: CreateDiaDto) {
    console.log('body reicbido', createDiaDto);
    try {
      return await this.diaService.create(createDiaDto);
    } catch (error) {
      throw new HttpException('Error al crear el dia', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Dia[]> {
    return this.diaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Dia> {
    return await this.diaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaDto: UpdateDiaDto,
  ): Promise<Dia> {
    return await this.diaService.update(id, updateDiaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.diaService.remove(id);
  }
}
