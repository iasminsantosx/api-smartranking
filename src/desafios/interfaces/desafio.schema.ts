import * as mongoose from "mongoose";

export const DesafioSchema = new mongoose.Schema({ 
    dataHoraDesafio: { type: Date },
    status: { type: String },
    dataHoraSolicitacao: { type: Date },
    dataHoraResposta: { type: Date },
    solicitante: { type: String },
    categoria: {},
    jogadores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jogador"
    }],
    partida: []
}, { timestamps: true, collection: 'categorias' })