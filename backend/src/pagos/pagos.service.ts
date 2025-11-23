import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto } from './dto/create.pago.dto';
import { UpdatePagoDto } from './dto/update.pago.dto';
import { Venta } from 'src/venta/entities/venta.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,

    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  async getAllPagos(): Promise<Pago[]> {
    return this.pagoRepository.find({
      relations: ['venta'],
      order: { fecha: 'DESC' },
    });
  }

  async getPagoById(id: number): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: ['venta'],
    });
    if (!pago) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
    return pago;
  }

  async createPago(createPagoDto: CreatePagoDto): Promise<Pago> {
    const venta = await this.findVenta(createPagoDto.ventaId);

    const pago = this.pagoRepository.create({
      medioDePago: createPagoDto.medioDePago,
      monto: createPagoDto.monto,
      estado: createPagoDto.estado,
      venta,
    });

    try {
      return await this.pagoRepository.save(pago);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePago(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.getPagoById(id);

    if (updatePagoDto.ventaId !== undefined) {
      pago.venta = await this.findVenta(updatePagoDto.ventaId);
    }

    if (updatePagoDto.medioDePago !== undefined) {
      pago.medioDePago = updatePagoDto.medioDePago;
    }

    if (updatePagoDto.monto !== undefined) {
      pago.monto = updatePagoDto.monto;
    }

    if (updatePagoDto.estado !== undefined) {
      pago.estado = updatePagoDto.estado;
    }

    try {
      return await this.pagoRepository.save(pago);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deletePago(id: number): Promise<void> {
    const resultado = await this.pagoRepository.delete({ id });
    if (!resultado.affected) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
  }

  private async findVenta(ventaId: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta: ventaId },
    });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${ventaId} no encontrada`);
    }
    return venta;
  }
}
