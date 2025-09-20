import { Module } from '@nestjs/common';
import { FichaDeSaludService } from './ficha-de-salud.service';
import { FichaDeSaludController } from './ficha-de-salud.controller';

@Module({
  controllers: [FichaDeSaludController],
  providers: [FichaDeSaludService],
})
export class FichaDeSaludModule {}
