import { Module } from '@nestjs/common';
import { FichaSaludService } from './ficha-salud.service';
import { FichaSaludController } from './ficha-salud.controller';
import { FichaSalud } from './entities/ficha-salud.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([FichaSalud, Usuario])],
  controllers: [FichaSaludController],
  providers: [FichaSaludService],
})
export class FichaSaludModule { }
