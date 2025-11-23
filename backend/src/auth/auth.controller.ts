import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuario/dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { response, type Response } from 'express';
@Controller('auth')
export class AuthController {
  // UsuarioService: any;
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createUsuarioDto: Usuario, @Res({ passthrough: true }) response: Response) {
    const { usuario, access_token } = await this.authService.login(createUsuarioDto.email, createUsuarioDto.password);
    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false, // solo por HTTPS
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 hora
    });
    return { message: 'Login exitoso', usuario };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return { message: 'Logout exitoso' };
  }
}



