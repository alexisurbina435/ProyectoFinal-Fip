import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { response, type Response } from 'express';
@Controller('auth')
export class AuthController {
  // UsuarioService: any;
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response) {
    const { usuario, access_token } = await this.authService.login(createAuthDto.email, createAuthDto.password);
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



