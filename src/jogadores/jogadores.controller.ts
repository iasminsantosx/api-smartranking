import { Controller, Post, Body, Get, Query, Delete, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller('api/jogadores')
export class JogadoresController {

    constructor( private readonly jogadoresService: JogadoresService ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() dto: CriarJogadorDto): Promise<Jogador>{

        return await this.jogadoresService.criarJogador(dto);
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(@Body() dto: AtualizarJogadorDto, 
        @Param('_id', JogadoresValidacaoParametrosPipe) _id:string
    ): Promise<void>{

        await this.jogadoresService.atualizarJogador(_id,dto);
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {

        return await this.jogadoresService.consultarTodosJogadores();
    }

    @Get('/:_id')
    async consultarJogadoresPorId(@Param('_id', JogadoresValidacaoParametrosPipe) _id: string): Promise<Jogador[] | Jogador> {

        return await this.jogadoresService.consultarJogadorPeloId(_id);
    }

    @Delete('/:_id')
    async deletarJogador (@Param('_id',JogadoresValidacaoParametrosPipe) _id: string): Promise<void> {

        await this.jogadoresService.deletarJogador(_id);
    }

}
