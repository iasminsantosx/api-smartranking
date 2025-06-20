import { Document } from "mongoose";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export interface Desafio extends Document {

    dataHoraDesafio: Date;
    status: string;
    dataHoraSolicitacao: Date;
    dataHoraResposta: Date;
    solicitante: Jogador;
    categoria: String;
    jogadores: Array<Jogador>;
    partida: {};
}

export interface Partida extends Document {
    categoria: string;
    jogadores: Array<Jogador>;
    def: Jogador;
    resultado: Array<Resultado>;
}

export interface Resultado {
    set: string;
}