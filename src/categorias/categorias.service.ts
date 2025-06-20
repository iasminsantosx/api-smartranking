import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ){}

    async criarCategoria( dto: CriarCategoriaDto ): Promise<Categoria>{

        const { categoria } = dto;

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria});

        if( categoriaEncontrada ) throw new BadRequestException(`A categoria ${categoria} já cadastrada!`);

        const categoriaCriada = new this.categoriaModel(dto);

        return await categoriaCriada.save();

    }

    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriaPeloId( categoria: string ): Promise<Categoria> {

        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).populate("jogadores").exec();

        if(!categoriaEncontrada) throw new NotFoundException(`Categoria ${categoria} não encontrada!`);

        return categoriaEncontrada;
    }

    async atualizarCategoria( categoria: string, dto: AtualizarCategoriaDto ): Promise<void> {

        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).exec();

        if(!categoriaEncontrada) throw new NotFoundException(`Categoria ${categoria} não encontrada!`);

        await this.categoriaModel.findOneAndUpdate( {categoria}, {$set: dto} ).exec();
    }

    async atribuirCategoriaJogador( params: string[] ): Promise<void>{

        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        const categoriaEncontrada = await this.categoriaModel.findOne({ categoria }).exec();

        if(!categoriaEncontrada) throw new NotFoundException(`Categoria ${categoria} não encontrada!`);

        await this.jogadoresService.consultarJogadorPeloId(idJogador);

        const jogadorCadastradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador).exec();

        if (jogadorCadastradoCategoria.length) throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`);

        categoriaEncontrada.jogadores.push(idJogador);

        await categoriaEncontrada.save();

    }

    async consultarCategoriaDoJogador(idJogador: string): Promise<Categoria> {

        await this.jogadoresService.consultarJogadorPeloId(idJogador);

        return await this.categoriaModel.findOne().where('jogadores').in([idJogador]).exec();

    }
}
