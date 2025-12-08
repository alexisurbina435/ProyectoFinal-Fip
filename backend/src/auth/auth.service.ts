import { BadRequestException, Injectable } from '@nestjs/common';
import { Usuario } from '../usuario/entities/usuario.entity';
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
  

  async login(email: string, passwordd: string): Promise<{ usuario: Omit<Usuario, 'password'>; access_token: string }> {
      const usuario = await this.usuarioRepository.findOne({ where: { email } });
      console.log('Usuario encontrado:', usuario);
      if (!usuario) {
        throw new BadRequestException('El usuario no existe');
      }
      const passwordValida = await bcrypt.compare(passwordd, usuario.password);
      console.log('Password válida:', passwordValida);
      if (!passwordValida) {
        throw new BadRequestException('La contraseña es incorrecta');
      }
      // quito la contraseña al logear 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...publicUser } = usuario;
      console.log('Usuario público:', publicUser);
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
  
      // El secret y expiresIn ya están configurados en el JwtModule
      // Solo necesitamos pasar el payload
      const access_token = this.jwtService.sign(payload);
  
  
      return {
        usuario: publicUser,
        access_token,
      };
  
    }
}
