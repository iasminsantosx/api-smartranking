import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/jogadores')
export class JogadoresController {

    constructor( private readonly jogadoresService: JogadoresService ) {}

    @Post()
    async criarAtualizarJogador(@Body() dto: CriarJogadorDto){

        await this.jogadoresService.criarAtualizarJogador(dto);
    }

    @Get()
    async consultarJogadores(@Query('email') email: string): Promise<Jogador[] | Jogador> {

        if (email) return await this.jogadoresService.consultarJogador(email);

        return await this.jogadoresService.consultarTodosJogadores();
    }

    @Delete()
    async deletarJogador (@Query('email') email: string): Promise<void> {

        return await this.jogadoresService.deletarJogador(email);
    }

}
