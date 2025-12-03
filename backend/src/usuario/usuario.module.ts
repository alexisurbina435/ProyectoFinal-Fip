import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
// import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
// import { Plan } from 'src/plan/entities/plan.entity';

@Module({
  //si hay algun error con el usuario probar cambiando los imports(el comentado por el otro)
  // imports: [JwtModule.register({}),TypeOrmModule.forFeature([Usuario])],
  imports: [AuthModule,TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}

