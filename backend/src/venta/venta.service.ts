import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class VentaService {

  constructor(
    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    
  ) { }

  
  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const usuario = await this.usuarioRepository.findOneBy({ id_usuario: createVentaDto.id_usuario });
    if(!usuario){
      throw new NotFoundException(`El usuario con ${createVentaDto.id_usuario} no existe`);
    }
    const venta = this.ventaRepo.create({ ...createVentaDto, usuario });
    return this.ventaRepo.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepo.find({relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepo.findOne({ where: { id_venta: id }, relations: ['usuario'] });
    if(!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return venta;
  }

  

  async remove(id: number): Promise<Venta> {
    const venta = await this.findOne(id);
    if(!venta){
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return this.ventaRepo.remove(venta);
  }
}
