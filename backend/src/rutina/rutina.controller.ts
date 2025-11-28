import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Delete } from '@nestjs/common';
import { RutinaService } from './rutina.service';
import { CreateRutinaDto, UpdateRutinaDto, CreateRutinaCompletaDto } from './dto';


@Controller('rutina')
export class RutinaController {
    

    constructor(private RutinaService: RutinaService){}


    @Get()
    async getAllRutinas(){
        const rutinas = await this.RutinaService.getAllRutinas();
        return rutinas;
    }

    @Get(':id')
    async getRutinaById(@Param('id') id: string){
        const rutina = await this.RutinaService.getRutinaById(Number(id));
        if (!rutina) {
            throw new NotFoundException('Rutina no encontrada.');
        }
        return rutina;
    }


    @Post()
    async postRutina(@Body()createRutinaDto: CreateRutinaDto){        
        try{
        const rutina = await this.RutinaService.postRutina(createRutinaDto); 
        return rutina
    }catch (ex) {
            throw new InternalServerErrorException(ex.message);
        }
    }

    @Post('completa')
    async postRutinaCompleta(@Body() createRutinaCompletaDto: CreateRutinaCompletaDto) {
        try {
            const rutina = await this.RutinaService.postRutinaCompleta(createRutinaCompletaDto);
            return rutina;
        } catch (ex) {
            throw new InternalServerErrorException(ex.message);
        }
    }


    @Put(':id')
    async putRutina(@Param ('id') id_rutina, @Body() UpdateRutinaDto: UpdateRutinaDto){
        const rutina = await this.RutinaService.putRutina(id_rutina,UpdateRutinaDto);
        if(!rutina){
            throw new NotFoundException('Rutina no encontrada.');
        }
        return rutina;
    }

    @Delete(':id')
    async deleteRutina(@Param ('id') id_rutina ){
        const result = await this.RutinaService.deleteRutina(id_rutina)
        if(result){
            return null;
        }
        throw new NotFoundException('Rutina no encontrada.');
    }
}
   


