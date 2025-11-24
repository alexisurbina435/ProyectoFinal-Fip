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
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Plan } from 'src/plan/entities/plan.entity';



@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    // private readonly jwtService: JwtService,
    // private readonly configService: ConfigService,
    // @InjectRepository(Plan)
    // private readonly planRepo: Repository<Plan>,
    
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
    const usuario: Usuario[] = await this.usuarioRepository.find({ relations: ['ficha', 'suscripciones'] });
    return usuario;
  }

  async getUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id }, 
      relations: ['ficha', 'suscripciones', 'rutina_activa'],
    });
    if (!usuario) {
      throw new NotFoundException(`usuario con ${id} no existe`);
    }
    return usuario;
  }

  async postUsuario(CreateUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const hashedPassword = await bcrypt.hash(CreateUsuarioDto.password, 10);
      const newUsuario = this.usuarioRepository.create({
        ...CreateUsuarioDto,
        password: hashedPassword,

      });

      const usuario = await this.usuarioRepository.save(newUsuario);
      return usuario;
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
  }

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

  async editarUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      // relations: ["plan"],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    //Si viene id_plan en el DTO, lo convertimos en relación
    // if (updateUsuarioDto.id_plan) {
    //   const plan = await this.planRepo.findOne({ where: { id_plan: updateUsuarioDto.id_plan } });
    //   if (!plan) {
    //     throw new NotFoundException(`Plan con id ${updateUsuarioDto.id_plan} no encontrado`);
    //   }
    //   usuario.plan = plan;
    // }

    const { password, ...rest } = updateUsuarioDto;
    this.usuarioRepository.merge(usuario, rest);

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    return await this.usuarioRepository.save(usuario);

  }



  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const result = await this.usuarioRepository.delete({ id_usuario });
    return (result.affected ?? 0) > 0;
  }
}
