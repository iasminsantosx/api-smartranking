import { Controller , Post, Put, Get, Delete , Logger, ValidationPipe, UsePipes, Body, Query, Param } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarCategoriaDto } from 'src/categorias/dtos/criar-categoria.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

@Controller('api/desafios')
export class DesafiosController {

    constructor(
        private readonly desafiosService: DesafiosService,
    ){}

    private readonly logger = new Logger(DesafiosController.name);


    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio( @Body() dto: CriarDesafioDto ): Promise<Desafio> {

        this.logger.log(`criarDesafioDto ${JSON.stringify(dto)}`);
        return await this.desafiosService.criarDesafio(dto);
    }

    @Get()
    async consultarDesafios(
        @Query('idJogador') _id: string): Promise<Array<Desafio>> {
        return _id ? await this.desafiosService.consultarDesafiosDeUmJogador(_id) 
        : await this.desafiosService.consultarTodosDesafios()
    }

    @Put('/:desafio')
    async atualizarDesafio(
        @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
        @Param('desafio') _id: string): Promise<void> {
            await this.desafiosService.atualizarDesafio(_id, atualizarDesafioDto)

    }   



    @Delete('/:_id')
    async deletarDesafio( @Param('_id') _id: string) : Promise<void> {
        await this.desafiosService.deletarDesafio(_id)
    }

    @Post('/:desafio/partida/')
     async atribuirDesafioPartida(
       @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
       @Param('desafio') _id: string): Promise<void> {
        return await this.desafiosService.atribuirDesafioPartida(_id, atribuirDesafioPartidaDto)           
   }

}
