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

  async getAllRutinas(): Promise<Rutina[]> {
    const rutina: Rutina[] = await this.rutinaRepository.find();
    return rutina;
  }

  async getRutinaById(id: number) {
    const rutina = await this.rutinaRepository.findOne({
      where: { id_rutina: id },
      relations: ['semanas', 'semanas.dias', 'semanas.dias.dificultades', 'semanas.dias.dificultades.ejercicio'],
    });

    return rutina;
  }

  async postRutina(createRutinaDto: CreateRutinaDto) {
    // Validar según el tipo de rutina
    if (createRutinaDto.tipo_rutina === TipoRutina.PLAN) {
      if (!createRutinaDto.categoria) {
        throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
      }
    }
    // NOTA: Para rutinas de tipo CLIENTE, el id_usuario se usa solo para asignarla como rutina_activa
    // pero la rutina en sí no tiene un propietario (puede ser compartida)

    const rutina = this.rutinaRepository.create({
      nombre: createRutinaDto.nombre,
      descripcion: createRutinaDto.descripcion,
      nivel: createRutinaDto.nivel,
      categoria: createRutinaDto.categoria,
      tipo_rutina: createRutinaDto.tipo_rutina,
    });
    
    const rutinaGuardada = await this.rutinaRepository.save(rutina);
    
    // Si es de tipo CLIENTE y se proporcionó id_usuario, asignarla como rutina activa
    if (createRutinaDto.tipo_rutina === TipoRutina.CLIENTE && createRutinaDto.id_usuario) {
      const usuarioEncontrado = await this.usuarioRepository.findOne({
        where: { id_usuario: createRutinaDto.id_usuario },
      });
      if (usuarioEncontrado) {
        // Desvincular rutina anterior si existe
        await this.dataSource
          .createQueryBuilder()
          .update(Usuario)
          .set({ rutina_activa: null as any })
          .where('id_usuario = :id_usuario', { id_usuario: createRutinaDto.id_usuario })
          .execute();
        
        // Asignar nueva rutina activa
        await this.usuarioRepository.update(
          { id_usuario: createRutinaDto.id_usuario },
          { rutina_activa: rutinaGuardada }
        );
      }
    }
    
    return rutinaGuardada;
  }

  async putRutina(
    id: number,
    updateRutinaDto: UpdateRutinaDto,
  ): Promise<Rutina | null> {
    const rutinaExistente = await this.rutinaRepository.findOne({
      where: { id_rutina: id },
    });

    if (!rutinaExistente) {
      return null;
    }

    // Validar según el tipo de rutina
    const tipoRutina = updateRutinaDto.tipo_rutina ?? rutinaExistente.tipo_rutina;
    if (tipoRutina === TipoRutina.PLAN) {
      if (!updateRutinaDto.categoria && !rutinaExistente.categoria) {
        throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
      }
    }

    // Actualizar rutina (sin campo usuario)
    const { id_usuario, ...datosActualizacion } = updateRutinaDto;
    this.rutinaRepository.merge(rutinaExistente, datosActualizacion);
    await this.rutinaRepository.save(rutinaExistente);

    // Si se proporcionó id_usuario y es tipo CLIENTE, asignar como rutina activa
    if (id_usuario !== undefined && tipoRutina === TipoRutina.CLIENTE) {
      const usuarioEncontrado = await this.usuarioRepository.findOne({
        where: { id_usuario },
      });
      if (usuarioEncontrado) {
        // Desvincular rutina anterior si existe
        await this.dataSource
          .createQueryBuilder()
          .update(Usuario)
          .set({ rutina_activa: null as any })
          .where('id_usuario = :id_usuario', { id_usuario })
          .execute();
        
        // Asignar nueva rutina activa
        await this.usuarioRepository.update(
          { id_usuario },
          { rutina_activa: rutinaExistente }
        );
      }
    }

    return await this.getRutinaById(id);
  }

  async deleteRutina(id_rutina: number): Promise<boolean> {
    // Verificar que la rutina existe
    const rutina = await this.rutinaRepository.findOne({ where: { id_rutina } });
    if (!rutina) {
      return false;
    }

    // Desvincular la rutina de todos los usuarios que la tengan como activa
    // Esto evita errores de foreign key constraint
    await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set({ rutina_activa: null as any })
      .where('rutina_activa_id = :id_rutina', { id_rutina })
      .execute();

    // Eliminar la rutina (las semanas, días y dificultades se eliminan en CASCADE)
    // Si la rutina existía antes y no hay excepciones, la eliminación fue exitosa
    await this.rutinaRepository.delete({ id_rutina });
    
    // Si llegamos aquí sin excepciones y la rutina existía, la eliminación fue exitosa
    return true;
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
      // 1. Validar según tipo de rutina
      if (createRutinaCompletaDto.tipo_rutina === TipoRutina.PLAN) {
        if (!createRutinaCompletaDto.categoria) {
          throw new BadRequestException('categoria es requerida para rutinas de tipo plan');
        }
      }

      // 2. Crear la rutina base (sin campo usuario)
      const rutina = queryRunner.manager.create(Rutina, {
        nombre: createRutinaCompletaDto.nombre,
        descripcion: createRutinaCompletaDto.descripcion,
        nivel: createRutinaCompletaDto.nivel,
        categoria: createRutinaCompletaDto.categoria,
        tipo_rutina: createRutinaCompletaDto.tipo_rutina,
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

      // 4. Si es una rutina de tipo CLIENTE y se proporcionó id_usuario, asignarla como rutina activa
      // IMPORTANTE: Desvincular primero la rutina anterior (si existe) antes de asignar la nueva
      if (createRutinaCompletaDto.tipo_rutina === TipoRutina.CLIENTE && createRutinaCompletaDto.id_usuario) {
        const usuarioEncontrado = await queryRunner.manager.findOne(Usuario, {
          where: { id_usuario: createRutinaCompletaDto.id_usuario },
        });
        
        if (!usuarioEncontrado) {
          throw new NotFoundException('Usuario no encontrado');
        }
        
        // Primero desvincular cualquier rutina activa anterior
        await queryRunner.manager
          .createQueryBuilder()
          .update(Usuario)
          .set({ rutina_activa: null as any })
          .where('id_usuario = :id_usuario', { id_usuario: createRutinaCompletaDto.id_usuario })
          .execute();
        
        // Luego asignar la nueva rutina activa
        await queryRunner.manager.update(Usuario, 
          { id_usuario: createRutinaCompletaDto.id_usuario },
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
