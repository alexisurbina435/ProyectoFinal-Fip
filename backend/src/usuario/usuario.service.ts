import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update.usuario.dto';
import { Rutina } from '../rutina/entities/rutina.entity';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Plan } from '../plan/entities/plan.entity';



@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rutina)
    private rutinaRepository: Repository<Rutina>,
    private readonly dataSource: DataSource,
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
    const usuario: Usuario[] = await this.usuarioRepository.find({ 
      relations: ['ficha', 'suscripciones', 'suscripciones.plan', 'rutina_activa'] 
    });
    return usuario;
  }

  async getUsuarioById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id }, 
      relations: ['ficha', 'suscripciones', 'suscripciones.plan', 'rutina_activa', 'rutina_activa.semanas', 'rutina_activa.semanas.dias', 'rutina_activa.semanas.dias.dificultades', 'rutina_activa.semanas.dias.dificultades.ejercicio'],
    });
    if (!usuario) {
      throw new NotFoundException(`usuario con ${id} no existe`);
    }
    return usuario;
  }

  async postUsuario(CreateUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {

      const emailExiste = await this.usuarioRepository.findOne({
        where: { email: CreateUsuarioDto.email },
      });

      if (emailExiste) {
        throw new ConflictException('El email ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(CreateUsuarioDto.password, 10);
      const newUsuario = this.usuarioRepository.create({
        ...CreateUsuarioDto,
        password: hashedPassword,

      });

      const usuario = await this.usuarioRepository.save(newUsuario);
      return usuario;
    } catch (ex) {
      if (ex instanceof ConflictException) {
        throw ex;
      }
      throw new BadRequestException(ex.message);
    }

  }

  async putUsuario(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const { password, rutina_activa_id, ...rest } = updateUsuarioDto;
    
    // Si se necesita desvincular la rutina, hacerlo primero con QueryBuilder
    if (rutina_activa_id === null) {
      await this.usuarioRepository
        .createQueryBuilder()
        .update(Usuario)
        .set({ rutina_activa: null as any })
        .where('id_usuario = :id', { id })
        .execute();
    }
    
    this.usuarioRepository.merge(usuario, rest);

    // Manejar rutina_activa_id si está presente (solo para asignar nueva rutina)
    // IMPORTANTE: Usar transacción para asegurar atomicidad (desvincular y asignar en una sola operación)
    if (rutina_activa_id !== undefined && rutina_activa_id !== null) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Verificar que la rutina existe antes de desvincular
        const rutina = await queryRunner.manager.findOne(Rutina, {
          where: { id_rutina: rutina_activa_id },
        });
        if (!rutina) {
          throw new NotFoundException(`Rutina con id ${rutina_activa_id} no encontrada`);
        }

        // Desvincular primero la rutina anterior (si existe) dentro de la transacción
        await queryRunner.manager
          .createQueryBuilder()
          .update(Usuario)
          .set({ rutina_activa: null as any })
          .where('id_usuario = :id', { id })
          .execute();
        
        // Asignar nueva rutina activa
        usuario.rutina_activa = rutina;
        
        // Si todo salió bien, hacer commit
        await queryRunner.commitTransaction();
      } catch (error) {
        // Si algo falla, hacer rollback (el usuario mantiene su rutina anterior)
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Liberar el query runner
        await queryRunner.release();
      }
    }

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    
    // Si se desvinculó la rutina, recargar para obtener el estado actualizado
    if (rutina_activa_id === null) {
      return await this.getUsuarioById(id);
    }

    return usuarioGuardado;
  }

  async editarUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      // relations: ["plan"],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const { password, ...rest } = updateUsuarioDto;
    
    this.usuarioRepository.merge(usuario, rest);

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    const usuarioGuardado = await this.usuarioRepository.save(usuario);
    return usuarioGuardado;
  }



  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const result = await this.usuarioRepository.delete({ id_usuario });
    return (result.affected ?? 0) > 0;
  }
}
