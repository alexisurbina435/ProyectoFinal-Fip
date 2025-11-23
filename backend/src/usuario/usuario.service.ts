import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update.usuario.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Plan } from 'src/plan/entities/plan.entity';



@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,




  ) { }
  // testeo 
  async findOne(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new BadRequestException('El usuario no existe');
    }
    return usuario;
  }

  findByEmail(email: string) {
    const usuario = this.usuarioRepository.findOne({ where: { email } });
    return usuario;
  }
  // fin testeo 
  async getAllUsuario(): Promise<Usuario[]> {
    const usuario: Usuario[] = await this.usuarioRepository.find({relations: ['plan'] });
    return usuario;
  }

  async getUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id }, relations: ['ficha', 'plan'],
    });
    if (!usuario) {
      throw new NotFoundException(`usuario con ${id} no existe`);
    }
    return usuario;
  }

  async postUsuario(CreateUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const plan = await this.planRepo.findOne({where: {id_plan: CreateUsuarioDto.id_plan}});
      const hashedPassword = await bcrypt.hash(CreateUsuarioDto.password, 10);
      const newUsuario = this.usuarioRepository.create({
        ...CreateUsuarioDto,
        password: hashedPassword,
        ...(plan ? { plan } : {}),
        
      });

      const usuario = await this.usuarioRepository.save(newUsuario);
      return usuario;
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
  }

  // async login(email: string, passwordd: string): Promise<Usuario | any> {
  //   const usuario = await this.usuarioRepository.findOne({ where: { email } });
  //   if (!usuario) {
  //     throw new BadRequestException('El usuario no existe');
  //   }
  //   const passwordValida = await bcrypt.compare(passwordd, usuario.password);
  //   if (!passwordValida) {
  //     throw new BadRequestException('La contraseña es incorrecta');
  //   }
  //   // quito la contraseña al logear 
  //   const { password: _, ...publicUser } = usuario;

  //   const payload = {
  //     sub: usuario.id_usuario,
  //     email: usuario.email,
  //     telefono: usuario.telefono,
  //     rol: usuario.rol,
  //   };

  //   const secret = this.configService.get<string>('JWT_SECRET');
  //   const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN');

  //   const access_token = this.jwtService.sign(payload, {
  //     secret: secret,
  //     expiresIn: expiresIn,
  //   });


  //   return {
  //     usuario: publicUser,
  //     access_token,
  //   };

  // }

  async putUsuario(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const rutina = this.usuarioRepository.create(updateUsuarioDto);
    const result = await this.usuarioRepository.update(
      { id_usuario: id },
      rutina,
    );
    if (!result.affected) {
    }
    return await this.getUsuarioById(id);
  }

  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const result = await this.usuarioRepository.delete({ id_usuario });
    return (result.affected ?? 0) > 0;
  }
}
