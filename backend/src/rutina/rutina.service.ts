import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rutina, TipoRutina } from './entities/rutina.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateRutinaDto, UpdateRutinaDto } from './dto';
import { CreateRutinaCompletaDto } from './dto/create-rutina-completa.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Semana } from '../semana/entities/semana.entity';
import { Dia } from '../dia/entities/dia.entity';
import { Dificultad } from '../dificultad/entities/dificultad.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RutinaService {
  constructor(
    @InjectRepository(Rutina)
    private rutinaRepository: Repository<Rutina>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Semana)
    private readonly semanaRepository: Repository<Semana>,

    @InjectRepository(Dia)
    private readonly diaRepository: Repository<Dia>,

    @InjectRepository(Dificultad)
    private readonly dificultadRepository: Repository<Dificultad>,

    @InjectRepository(Ejercicio)
    private readonly ejercicioRepository: Repository<Ejercicio>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Obtiene o crea el usuario sistema para rutinas generales
   * Este usuario se usa como "propietario" de rutinas generales y de plan
   */
  private async obtenerUsuarioSistema(): Promise<Usuario> {
    // Buscar usuario sistema por email
    let usuarioSistema = await this.usuarioRepository.findOne({
      where: { email: 'sistema@gym.com' },
    });

    if (!usuarioSistema) {
      // Crear usuario sistema si no existe
      const hashedPassword = await bcrypt.hash('sistema_interno_no_login', 10);
      usuarioSistema = this.usuarioRepository.create({
        nombre: 'Sistema',
        apellido: 'Gym',
        email: 'sistema@gym.com',
        telefono: '0000000000',
        password: hashedPassword,
        rol: 'admin' as any,
        estado_pago: false,
      });
      usuarioSistema = await this.usuarioRepository.save(usuarioSistema);
    }

    return usuarioSistema;
  }

  async getAllRutinas(): Promise<Rutina[]> {
    const rutina: Rutina[] = await this.rutinaRepository.find({
      relations: ['usuario'],
    });
    return rutina;
  }

  async getRutinaById(id: number) {
    const rutina = await this.rutinaRepository.findOne({
      where: { id_rutina: id },
      relations: ['usuario', 'semanas', 'semanas.dias', 'semanas.dias.dificultades', 'semanas.dias.dificultades.ejercicio'],
    });

    return rutina;
  }

  async postRutina(createRutinaDto: CreateRutinaDto) {
    let usuario: Usuario | undefined = undefined;

    // Validar y obtener usuario según el tipo de rutina
    if (createRutinaDto.tipo_rutina === TipoRutina.CLIENTE) {
      if (!createRutinaDto.id_usuario) {
        throw new BadRequestException('id_usuario es requerido para rutinas de tipo cliente');
      }
      const usuarioEncontrado = await this.usuarioRepository.findOne({
        where: { id_usuario: createRutinaDto.id_usuario },
      });
      if (!usuarioEncontrado) {
        throw new NotFoundException('Usuario no encontrado');
      }
      usuario = usuarioEncontrado;
    } else if (createRutinaDto.tipo_rutina === TipoRutina.PLAN) {
      // Para rutinas de plan, usar usuario sistema
      usuario = await this.obtenerUsuarioSistema();
      if (!createRutinaDto.categoria) {
        throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
      }
    } else if (createRutinaDto.tipo_rutina === TipoRutina.GENERAL) {
      // Para rutinas generales, usar usuario sistema
      usuario = await this.obtenerUsuarioSistema();
    }

    const rutina = this.rutinaRepository.create({
      nombre: createRutinaDto.nombre,
      descripcion: createRutinaDto.descripcion,
      nivel: createRutinaDto.nivel,
      categoria: createRutinaDto.categoria,
      tipo_rutina: createRutinaDto.tipo_rutina,
      usuario: usuario,
    });
    return await this.rutinaRepository.save(rutina);
  }

  async putRutina(
    id: number,
    updateRutinaDto: UpdateRutinaDto,
  ): Promise<Rutina | null> {
    const rutinaExistente = await this.rutinaRepository.findOne({
      where: { id_rutina: id },
      relations: ['usuario'],
    });

    if (!rutinaExistente) {
      return null;
    }

    // Si se actualiza el tipo_rutina o id_usuario, validar y obtener usuario
    if (updateRutinaDto.tipo_rutina !== undefined || updateRutinaDto.id_usuario !== undefined) {
      const tipoRutina = updateRutinaDto.tipo_rutina ?? rutinaExistente.tipo_rutina;
      let usuario: Usuario | undefined = undefined;

      if (tipoRutina === TipoRutina.CLIENTE) {
        const idUsuario = updateRutinaDto.id_usuario ?? rutinaExistente.usuario?.id_usuario;
        if (!idUsuario) {
          throw new BadRequestException('id_usuario es requerido para rutinas de tipo cliente');
        }
        const usuarioEncontrado = await this.usuarioRepository.findOne({
          where: { id_usuario: idUsuario },
        });
        if (!usuarioEncontrado) {
          throw new NotFoundException('Usuario no encontrado');
        }
        usuario = usuarioEncontrado;
      } else if (tipoRutina === TipoRutina.PLAN) {
        usuario = await this.obtenerUsuarioSistema();
        if (!updateRutinaDto.categoria && !rutinaExistente.categoria) {
          throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
        }
      } else if (tipoRutina === TipoRutina.GENERAL) {
        usuario = await this.obtenerUsuarioSistema();
      }

      // Actualizar con el usuario correcto
      const rutinaActualizada = this.rutinaRepository.merge(rutinaExistente, {
        ...updateRutinaDto,
        usuario: usuario,
      });
      await this.rutinaRepository.save(rutinaActualizada);
    } else {
      // Actualización normal sin cambio de tipo
      this.rutinaRepository.merge(rutinaExistente, updateRutinaDto);
      await this.rutinaRepository.save(rutinaExistente);
    }

    return await this.getRutinaById(id);
  }

  async deleteRutina(id_rutina: number): Promise<boolean> {
    const result = await this.rutinaRepository.delete({ id_rutina });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Crea una rutina completa con semanas, días y ejercicios en una sola transacción
   * Esto asegura que si algo falla, todo se revierte (rollback)
   */
  async postRutinaCompleta(createRutinaCompletaDto: CreateRutinaCompletaDto): Promise<Rutina> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar y obtener usuario según tipo de rutina
      let usuario: Usuario | undefined = undefined;

      if (createRutinaCompletaDto.tipo_rutina === TipoRutina.CLIENTE) {
        if (!createRutinaCompletaDto.id_usuario) {
          throw new BadRequestException('id_usuario es requerido para rutinas de tipo cliente');
        }
        const usuarioEncontrado = await queryRunner.manager.findOne(Usuario, {
          where: { id_usuario: createRutinaCompletaDto.id_usuario },
        });
        if (!usuarioEncontrado) {
          throw new NotFoundException('Usuario no encontrado');
        }
        usuario = usuarioEncontrado;
      } else if (createRutinaCompletaDto.tipo_rutina === TipoRutina.PLAN) {
        usuario = await this.obtenerUsuarioSistema();
        if (!createRutinaCompletaDto.categoria) {
          throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
        }
      } else if (createRutinaCompletaDto.tipo_rutina === TipoRutina.GENERAL) {
        usuario = await this.obtenerUsuarioSistema();
      }

      // 2. Crear la rutina base
      const rutina = queryRunner.manager.create(Rutina, {
        nombre: createRutinaCompletaDto.nombre,
        descripcion: createRutinaCompletaDto.descripcion,
        nivel: createRutinaCompletaDto.nivel,
        categoria: createRutinaCompletaDto.categoria,
        tipo_rutina: createRutinaCompletaDto.tipo_rutina,
        usuario: usuario,
      });
      const rutinaGuardada = await queryRunner.manager.save(Rutina, rutina);

      // 3. Crear semanas, días y dificultades
      for (const semanaDto of createRutinaCompletaDto.semanas) {
        const semana = queryRunner.manager.create(Semana, {
          numero_semana: semanaDto.numero_semana,
          rutina: rutinaGuardada,
        });
        const semanaGuardada = await queryRunner.manager.save(Semana, semana);

        for (const diaDto of semanaDto.dias) {
          const dia = queryRunner.manager.create(Dia, {
            numero_dia: diaDto.numero_dia,
            semana: semanaGuardada,
          });
          const diaGuardado = await queryRunner.manager.save(Dia, dia);

          for (const ejercicioDto of diaDto.ejercicios) {
            // Validar que el ejercicio existe
            const ejercicio = await queryRunner.manager.findOne(Ejercicio, {
              where: { id_ejercicio: ejercicioDto.ejercicioId },
            });

            if (!ejercicio) {
              throw new NotFoundException(
                `Ejercicio con id ${ejercicioDto.ejercicioId} no encontrado`,
              );
            }

            const dificultad = queryRunner.manager.create(Dificultad, {
              peso: ejercicioDto.peso || 0,
              repeticiones: ejercicioDto.repeticiones,
              series: ejercicioDto.series,
              dia: diaGuardado,
              ejercicio: ejercicio,
            });
            await queryRunner.manager.save(Dificultad, dificultad);
          }
        }
      }

      // 4. Si es una rutina de tipo CLIENTE, asignarla como rutina activa del usuario
      if (createRutinaCompletaDto.tipo_rutina === TipoRutina.CLIENTE && usuario) {
        await queryRunner.manager.update(Usuario, 
          { id_usuario: usuario.id_usuario },
          { rutina_activa: rutinaGuardada }
        );
      }

      // Si todo salió bien, hacer commit
      await queryRunner.commitTransaction();

      // Retornar la rutina completa con todas las relaciones
      const rutinaCompleta = await this.getRutinaById(rutinaGuardada.id_rutina);
      if (!rutinaCompleta) {
        throw new InternalServerErrorException('Error al recuperar la rutina creada');
      }
      return rutinaCompleta;
    } catch (error) {
      // Si algo falla, hacer rollback
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }
}
