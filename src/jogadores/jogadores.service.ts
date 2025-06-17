import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name);

    async criarJogador(dto: CriarJogadorDto): Promise<Jogador> {

        this.logger.debug(`criarJogadorDto ${JSON.stringify(dto)}`);

        const { email, telefoneCelular } = dto;

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec() || await this.jogadorModel.findOne({ telefoneCelular }).exec();

        if (jogadorEncontrado) throw new BadRequestException(`Jogador existente com esse email ou celular`);
        
        const jogadorCriado = new this.jogadorModel(dto);

        return await jogadorCriado.save();

    }

    async atualizarJogador(_id:string, dto: AtualizarJogadorDto): Promise<void> {

        this.logger.debug(`criarAtualizarJogadorDto ${JSON.stringify(dto)}`);

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if (!jogadorEncontrado) throw new NotFoundException(`Jogador não encontrado`);
        
        await this.jogadorModel.findOneAndUpdate({ _id },
            { $set: dto }).exec();

    }

    async consultarTodosJogadores (): Promise<Jogador[]> {

        return await this.jogadorModel.find().exec();
    }

    async consultarJogadorPeloId (_id:string): Promise<Jogador> {

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if(!jogadorEncontrado) throw new NotFoundException('Jogador não encontrado!');

        return jogadorEncontrado;
    }

    async deletarJogador ( _id: string ): Promise<any> {

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if(!jogadorEncontrado) throw new NotFoundException('Jogador não encontrado!');

        return this.jogadorModel.deleteOne({ _id }).exec()
    }
}
