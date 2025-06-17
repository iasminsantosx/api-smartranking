import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {

    @IsNotEmpty()
    readonly nome: string;

}