import { Injectable, Logger } from '@nestjs/common';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class DesafiosService {

    constructor(
        private readonly jogadorService: JogadoresService,
        private readonly categoriaService: CategoriasService
    ){}

    private readonly logger = new Logger(DesafiosService.name);

}
