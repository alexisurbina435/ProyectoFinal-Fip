import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import  {Producto} from './entities/producto.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {

    constructor(
     @InjectRepository(Producto)
          private ProductoRepository: Repository<Producto>
    ){}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
  const producto = this.ProductoRepository.create(createProductoDto)
    return this.ProductoRepository.save(producto);
  }

   async findAllProductos(): Promise <Producto[]> {
    return this.ProductoRepository.find();
   }

  async findOne(id: number):Promise <Producto> {
    const producto = await this.ProductoRepository.findOne({where:{id_producto:id}})
    if(!producto){
      throw new NotFoundException(`Producto con el ${id} no se pudo encontrar`)
    }
    return producto
    
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise <Producto> {
    const producto = await this.findOne(id)
    this.ProductoRepository.merge(producto, updateProductoDto)
    return this.ProductoRepository.save(producto)
  }

  async remove(id: number): Promise <Producto> {
    const producto = await this.findOne(id)
    return this.ProductoRepository.remove(producto)
  }
}
