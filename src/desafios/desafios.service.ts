import { BadRequestException, Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto'
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

@Injectable()
export class DesafiosService {

    constructor(
        private readonly jogadorService: JogadoresService,
        private readonly categoriaService: CategoriasService,
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>
    ){}

    private readonly logger = new Logger(DesafiosService.name);

    async criarDesafio( dto: CriarDesafioDto ): Promise<Desafio> {

        const jogadores = await this.jogadorService.consultarTodosJogadores();

        dto.jogadores.map(jogadorDto => {
            const jogadorFilter = jogadores.filter( jogador => jogador._id == jogadorDto._id )
            
            if (!jogadorFilter.length){
                throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`);
            }
        })

        const solicitanteEhJogadorDaPartida = dto.jogadores.filter( jogador => jogador._id == dto.solicitante._id);

        this.logger.log(`solicitanteEhJogadorDaPartida: ${solicitanteEhJogadorDaPartida}`);

        if(!solicitanteEhJogadorDaPartida.length) {
            throw new BadRequestException('O solicitante deve ser um jogador da partida!');
        }
        
        const categoriaDoJogador = await this.categoriaService.consultarCategoriaDoJogador(String(dto.solicitante._id));

        if(!categoriaDoJogador) {
            throw new BadRequestException(`O solicitante precisa estar registrado em uma categoria!`);
        }

        const desafioCriado = new this.desafioModel(dto);
        desafioCriado.categoria = categoriaDoJogador.categoria;
        desafioCriado.dataHoraSolicitacao = new Date();

        desafioCriado.status = 'Pendente';
        
        this.logger.log(`desafioCridado: ${JSON.stringify(desafioCriado)}`);

        return await desafioCriado.save();
    }

    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find()
        .populate("solicitante")
        .populate("jogadores")
        .populate("partida")
        .exec()
    }

    async consultarDesafiosDeUmJogador(_id: any): Promise<Array<Desafio>> {

       await this.jogadorService.consultarJogadorPeloId(_id);
        return await this.desafioModel.find()
            .where('jogadores')
            .in(_id)
            .populate("solicitante")
            .populate("jogadores")
            .populate("partida")
            .exec();

    }

    async atualizarDesafio(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
   
        const desafioEncontrado = await this.desafioModel.findById(_id).exec()

        if (!desafioEncontrado) {
            throw new NotFoundException(`Desafio ${_id} não cadastrado!`)
        }

        if (atualizarDesafioDto.status){
           desafioEncontrado.dataHoraResposta = new Date()         
        }
        desafioEncontrado.status = atualizarDesafioDto.status
        desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio

        await this.desafioModel.findOneAndUpdate({_id},{$set: desafioEncontrado}).exec()
        
    }

    async deletarDesafio(_id: string): Promise<void> {

        const desafioEncontrado = await this.desafioModel.findById(_id).exec()

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
        }
        
       desafioEncontrado.status = DesafioStatus.CANCELADO

       await this.desafioModel.findOneAndUpdate({_id},{$set: desafioEncontrado}).exec() 

    }

    async atribuirDesafioPartida(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto ): Promise<void> {

        const desafioEncontrado = await this.desafioModel.findById(_id).exec()
        
        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
        }

         /*
        Verificar se o jogador vencedor faz parte do desafio
        */
       const jogadorFilter = desafioEncontrado.jogadores.filter( jogador => jogador._id == atribuirDesafioPartidaDto.def )

        this.logger.log(`desafioEncontrado: ${desafioEncontrado}`)
        this.logger.log(`jogadorFilter: ${jogadorFilter}`)

       if (jogadorFilter.length == 0) {
           throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`)
       }

        /*
        Primeiro vamos criar e persistir o objeto partida
        */
       const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto)

       /*
       Atribuir ao objeto partida a categoria recuperada no desafio
       */
       partidaCriada.categoria = String(desafioEncontrado.categoria);

       /*
       Atribuir ao objeto partida os jogadores que fizeram parte do desafio
       */
       partidaCriada.jogadores = desafioEncontrado.jogadores

       const resultado = await partidaCriada.save()
       
        /*
        Quando uma partida for registrada por um usuário, mudaremos o 
        status do desafio para realizado
        */
        desafioEncontrado.status = DesafioStatus.REALIZADO

        /*  
        Recuperamos o ID da partida e atribuimos ao desafio
        */
        desafioEncontrado.partida = resultado._id

        try {
        await this.desafioModel.findOneAndUpdate({_id},{$set: desafioEncontrado}).exec() 
        } catch (error) {
            /*
            Se a atualização do desafio falhar excluímos a partida 
            gravada anteriormente
            */
           await this.partidaModel.deleteOne({_id: resultado._id}).exec();
           throw new InternalServerErrorException()
        }
    }


}
