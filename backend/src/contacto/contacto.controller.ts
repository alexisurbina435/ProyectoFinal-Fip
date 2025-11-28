import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { Contacto } from './entities/contacto.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsuarioService } from 'src/usuario/usuario.service';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService,
    private readonly usuarioService: UsuarioService,
  ) { }

  @Post()
  async create(@Body() createContactoDto: CreateContactoDto): Promise<Contacto> {
    try {
      return await this.contactoService.create(createContactoDto);
    } catch (error) {
      throw new HttpException(
        'Error al crear la consulta',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request): Promise<Contacto[]> {
    const usuario = req['usuario'];
    const usuarioDto = await this.usuarioService.getUsuarioById(usuario.id_usuario);
    if(!usuario || usuarioDto.rol !== 'admin'){
      throw new HttpException(
        'No tienes permiso para ver las consultas',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      return await this.contactoService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error al obtener las consultas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contacto> {
    try {
      return this.contactoService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        'Error al obtener la consulta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactoDto: UpdateContactoDto) : Promise<Contacto> {
    try {
      return this.contactoService.update(+id, updateContactoDto);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar la consulta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Contacto>  {
    try{
      return this.contactoService.remove(+id);
    }catch (error) {
      throw new HttpException(
        'Error al eliminar la consulta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
