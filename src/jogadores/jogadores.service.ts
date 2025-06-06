import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

    private jogadores: Jogador[] = [];
    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(dto: CriarJogadorDto): Promise<void> {

        this.logger.debug(`criarAtualizarJogadorDto ${JSON.stringify(dto)}`);

        const { email } = dto;

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        if (jogadorEncontrado) this.atualizar(jogadorEncontrado,dto);
        
        else this.criar(dto);

    }

    async consultarTodosJogadores (): Promise<Jogador[]> {
        return await this.jogadores;
    }

    async consultarJogador (email:string): Promise<Jogador> {

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        if(!jogadorEncontrado) throw new NotFoundException('Jogador não encontrado!');

        return jogadorEncontrado;
    }

    async deletarJogador (email:string): Promise<void> {

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

        if(!jogadorEncontrado) throw new NotFoundException('Jogador não encontrado!');

        this.jogadores = this.jogadores.filter(jogador => jogador.email !== email);

    }

    private criar(dto: CriarJogadorDto): void {

        const { nome, email, telefoneCelular } = dto;

        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        };

        this.jogadores.push(jogador);
    }

    private atualizar(jogadorEncontrado: Jogador, dto: CriarJogadorDto): void {

        const { nome } = dto;

        jogadorEncontrado.nome = nome;
    }
}
