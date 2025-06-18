import { Controller , Post, Put, Get, Delete , Logger, ValidationPipe, UsePipes, Body, Param } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarCategoriaDto } from 'src/categorias/dtos/criar-categoria.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';

@Controller('desafios')
export class DesafiosController {

    constructor(
        private readonly deasfiosService: DesafiosService,
    ){}

    private readonly logger = new Logger(DesafiosController.name);


    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio( @Body() dto: CriarDesafioDto ): Promise<Desafio> {

        this.logger.log(`criarDesafioDto ${JSON.stringify(CriarCategoriaDto)}`);
        return await this.deasfiosService.criarDesafio(dto);
    }

    @Get()
    async consultarDesafios(){}

    @Put('/:desafio')
    async atualizarDesafio(){}

    @Post('/:desafio/partida')
    async atribuirDesafioPartida(){}

    @Delete('/:_id')
    async deletarDesafio(){}

}
