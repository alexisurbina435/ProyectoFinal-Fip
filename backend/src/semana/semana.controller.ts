import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SemanaService } from './semana.service';
import { CreateSemanaDto } from './dto/create.semana.dto';
import type { UpdateSemanaDto } from './dto/update.semana.dto';

@Controller('semana')
export class SemanaController {
  constructor(private readonly semanaService: SemanaService) {}

  @Post()
  post(@Body() createSemanaDto: CreateSemanaDto) {
    return this.semanaService.postSemana(createSemanaDto);
  }

  @Get()
  getAllSemana() {
    return this.semanaService.getAllSemana();
  }

  @Get(':id')
  getSemanaById(@Param('id') id: string) {
    return this.semanaService.getSemanaById(+id);
  }

  @Put(':id')
  putSemana(@Param('id') id: string, @Body() updateSemanaDto: UpdateSemanaDto) {
    return this.semanaService.putSemana(+id, updateSemanaDto);
  }

  @Delete(':id')
  deleteSemana(@Param('id') id: string) {
    return this.semanaService.deleteSemana(+id);
  }
}
