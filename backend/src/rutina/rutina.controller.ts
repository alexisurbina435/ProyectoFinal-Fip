import { Body, Controller, Get, InternalServerErrorException, NotFoundException, BadRequestException, Param, Post, Put, Delete } from '@nestjs/common';
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
        try {
            const id = Number(id_rutina);
            if (isNaN(id)) {
                throw new BadRequestException('ID de rutina inválido');
            }
            const result = await this.RutinaService.deleteRutina(id);
            
            // Si el servicio devuelve true, la eliminación fue exitosa
            if(result === true){
                return { message: 'Rutina eliminada exitosamente' };
            }
            
            // Si devuelve false, la rutina no existía
            throw new NotFoundException('Rutina no encontrada.');
        } catch (ex) {
            // Si es una excepción de tipo NotFoundException o BadRequestException, la relanzamos
            if (ex instanceof NotFoundException || ex instanceof BadRequestException) {
                throw ex;
            }
            // Cualquier otra excepción se convierte en InternalServerErrorException
            throw new InternalServerErrorException(ex.message || 'Error al eliminar la rutina');
        }
    }
}
   


