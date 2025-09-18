import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FichaDeSaludService } from './ficha-de-salud.service';
import { CreateFichaDeSaludDto } from './dto/create-ficha-de-salud.dto';
import { UpdateFichaDeSaludDto } from './dto/update-ficha-de-salud.dto';

@Controller('ficha-de-salud')
export class FichaDeSaludController {
  constructor(private readonly fichaDeSaludService: FichaDeSaludService) {}

  @Post()
  create(@Body() createFichaDeSaludDto: CreateFichaDeSaludDto) {
    return this.fichaDeSaludService.create(createFichaDeSaludDto);
  }

  @Get()
  findAll() {
    return this.fichaDeSaludService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichaDeSaludService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFichaDeSaludDto: UpdateFichaDeSaludDto) {
    return this.fichaDeSaludService.update(+id, updateFichaDeSaludDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichaDeSaludService.remove(+id);
  }
}
