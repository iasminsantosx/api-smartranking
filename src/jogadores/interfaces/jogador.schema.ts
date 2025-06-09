import * as moongose from 'mongoose';

export const JogadorSchema = new moongose.Schema({
    telefoneCelular: { type: String, unique: true },
    email: { type: String, unique: true },
    nome: { type: String },
    ranking: { type: String },
    urlFotoJogador: { type: String },
}, { timestamps: true, collection: 'jogadores' });