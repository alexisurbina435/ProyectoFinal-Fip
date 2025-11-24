import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(Usuario)
      private readonly usuarioRepository: Repository<Usuario>,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) { }
  

  async login(email: string, passwordd: string): Promise<Usuario | any> {
      const usuario = await this.usuarioRepository.findOne({ where: { email } });
      if (!usuario) {
        throw new BadRequestException('El usuario no existe');
      }
      const passwordValida = await bcrypt.compare(passwordd, usuario.password);
      if (!passwordValida) {
        throw new BadRequestException('La contraseña es incorrecta');
      }
      // quito la contraseña al logear 
      const { password: _, ...publicUser } = usuario;
  
      const payload = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        // saco rol del payload por que encontre un bug, cuando cambio rol de usuario a admin sigue siendo usuario 
        // rol: usuario.rol,
        // tipoPlan: usuario.tipoPlan,
        // id_plan: usuario.plan?.id_plan,
        // estadoPago: usuario.estado_pago,
      };
  
      const secret = this.configService.get<string>('JWT_SECRET');
      const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN');
  
      const access_token = this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: expiresIn,
      });
  
  
      return {
        usuario: publicUser,
        access_token,
      };
  
    }
}
