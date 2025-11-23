import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update.usuario.dto';
import { Usuario } from './entities/usuario.entity';

import { AuthGuard } from 'src/auth/auth.guard';


@Controller('usuario')
export class UsuarioController {
  constructor(private UsuarioService: UsuarioService) { }

  @Get()
  async getAllUsuarios() {
    const usuario = await this.UsuarioService.getAllUsuario();
    return usuario;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUsuarioById(@Req() req: Request) {

    const usuario = req['usuario'];
    //console log para ver los datos del usuario en el token , borrar despues
    console.log("Usuario desde token:", usuario);

    return this.UsuarioService.getUsuarioById(usuario.id_usuario);
  }



  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.UsuarioService.findByEmail(email);
  }

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body() createUsuarioDto: Usuario, @Res({ passthrough: true }) response: Response) {
  //   const { usuario, access_token } = await this.UsuarioService.login(createUsuarioDto.email, createUsuarioDto.password);
  //   response.cookie('token', access_token, {
  //     httpOnly: true,
  //     secure: true, // solo por HTTPS
  //     sameSite: 'strict',
  //     maxAge: 3600 * 1000, // 1 hora
  //   });
  //   return { message: 'Login exitoso', usuario };
  // }

  @Post('registro')
  async postUsuario(@Body() createUsuarioDto: Usuario): Promise<Usuario> {
    const usuario: Usuario = await this.UsuarioService.postUsuario(createUsuarioDto);
    return usuario;
  }

  @Put(':id')
  async putUsuario(
    @Param('id') id_usuario,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
  ) {
    const rutina = await this.UsuarioService.putUsuario(
      id_usuario,
      UpdateUsuarioDto,
    );
    if (!rutina) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return rutina;
  }

  @Delete(':id')
  async deleteUsuario(@Param('id') id_usuario) {
    const result = await this.UsuarioService.deleteUsuario(id_usuario);
    if (result) {
      return null;
    }
    throw new NotFoundException('usuario no encontrado.');
  }
}
