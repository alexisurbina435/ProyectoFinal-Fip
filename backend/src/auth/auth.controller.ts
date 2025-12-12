import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Usuario } from '../usuario/entities/usuario.entity';
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
      secure: true, // solo por HTTPS
      sameSite: 'none',//para el deploy
      //sameSite: 'lax',// para el localhost
      maxAge: 5 * 60 * 60 * 1000, // 5 horas
      path:'/' 
    });
    return { message: 'Login exitoso', usuario };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token',{
      httpOnly: true,
      secure: true, // solo por HTTPS
      sameSite: 'none',//para el deploy
      // sameSite: 'lax',// para el localhost
      maxAge: 5 * 60 * 60 * 1000, // 5 horas
      path:'/' 
    });
    return { message: 'Logout exitoso' };
  }
}



