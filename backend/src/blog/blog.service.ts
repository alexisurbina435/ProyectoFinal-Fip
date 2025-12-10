import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find({
      // relations: ['usuario'],
      order: { fecha_publicacion: 'DESC' },
    });
  }

  async getBlogById(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id_blog: id },
      relations: ['usuario'],
    });
    if (!blog) {
      throw new NotFoundException(`Blog con id ${id} no encontrado`);
    }
    return blog;
  }

  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    // const usuario = await this.findUsuario(createBlogDto.id_usuario);

    const blog = this.blogRepository.create({
      imagen: createBlogDto.imagen,
      categoria: createBlogDto.categoria,
      titulo: createBlogDto.titulo,
      glosario: createBlogDto.glosario,
      contenido: createBlogDto.contenido,
      // usuario,
    });

    try {
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateBlog(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.getBlogById(id);

    // if (updateBlogDto.id_usuario !== undefined) {
    //   blog.usuario = await this.findUsuario(updateBlogDto.id_usuario);
    // }

    if (updateBlogDto.imagen !== undefined) {
      blog.imagen = updateBlogDto.imagen;
    }

    if (updateBlogDto.categoria !== undefined) {
      blog.categoria = updateBlogDto.categoria;
    }

    if (updateBlogDto.titulo !== undefined) {
      blog.titulo = updateBlogDto.titulo;
    }

    if (updateBlogDto.glosario !== undefined) {
      blog.glosario = updateBlogDto.glosario;
    }

    if (updateBlogDto.contenido !== undefined) {
      blog.contenido = updateBlogDto.contenido;
    }

    try {
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteBlog(id: number): Promise<void> {
    const result = await this.blogRepository.delete({ id_blog: id });
    if (!result.affected) {
      throw new NotFoundException(`Blog con id ${id} no encontrado`);
    }
  }

  private async findUsuario(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }
}
