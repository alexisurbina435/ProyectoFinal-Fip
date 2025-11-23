import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rutina } from './entities/rutina.entity';
import { Repository } from 'typeorm';
import { CreateRutinaDto, UpdateRutinaDto } from './dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class RutinaService {
  constructor(
    @InjectRepository(Rutina)
    private rutinaRepository: Repository<Rutina>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getAllRutinas(): Promise<Rutina[]> {
    const rutina: Rutina[] = await this.rutinaRepository.find();
    return rutina;
  }

  async getRutinaById(id: number) {
    const rutina = await this.rutinaRepository.findOne({
      where: { id_rutina: id },
    });

    return rutina;
  }

  async postRutina(createRutinaDto: CreateRutinaDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: createRutinaDto.id_usuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const rutina = this.rutinaRepository.create({
      descripcion: createRutinaDto.descripcion,
      categoria: createRutinaDto.categoria,
      usuario: usuario,
    });
    return await this.rutinaRepository.save(rutina);
  }

  async putRutina(
    id: number,
    updateRutinaDto: UpdateRutinaDto,
  ): Promise<Rutina | null> {
    const rutina = this.rutinaRepository.create(updateRutinaDto);
    const result = await this.rutinaRepository.update(
      { id_rutina: id },
      rutina,
    );
    if (!result.affected) {
      return null;
    }
    return await this.getRutinaById(id);
  }

  async deleteRutina(id_rutina: number): Promise<boolean> {
    const result = await this.rutinaRepository.delete({ id_rutina });
    return (result.affected ?? 0) > 0;
  }
}
