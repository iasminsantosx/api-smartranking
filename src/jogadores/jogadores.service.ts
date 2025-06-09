import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name);

    async criarAtualizarJogador(dto: CriarJogadorDto): Promise<void> {

        this.logger.debug(`criarAtualizarJogadorDto ${JSON.stringify(dto)}`);

        const { email } = dto;

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

        if (jogadorEncontrado) this.atualizar(jogadorEncontrado,dto);
        
        else this.criar(dto);

    }

    async consultarTodosJogadores (): Promise<Jogador[]> {

        return await this.jogadorModel.find().exec();
    }

    async consultarJogador (email:string): Promise<Jogador> {

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

        if(!jogadorEncontrado) throw new NotFoundException('Jogador não encontrado!');

        return jogadorEncontrado;
    }

    async deletarJogador ( email: string ): Promise<any> {

        return this.jogadorModel.deleteOne({ email }).exec()
    }

    private async criar(dto: CriarJogadorDto): Promise<Jogador> {

        const jogadorCriado = new this.jogadorModel(dto);

        return await jogadorCriado.save();
    }

    private async atualizar(jogadorEncontrado: Jogador, dto: CriarJogadorDto): Promise<Jogador> {

        return await this.jogadorModel.findOneAndUpdate({ email: jogadorEncontrado.email },
            { $set: dto }).exec();
    }
}
