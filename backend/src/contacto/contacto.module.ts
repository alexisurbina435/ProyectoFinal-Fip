import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
// import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
// import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';


@Module({
  
  imports: [AuthModule, UsuarioModule,TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule { }
