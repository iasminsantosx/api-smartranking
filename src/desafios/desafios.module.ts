import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { PartidaSchema } from './interfaces/partida.schema';

@Module({
  imports: [
              MongooseModule.forFeature([{name: 'Desafio', schema: DesafioSchema}, {name: 'Partida', schema: PartidaSchema}]),
              JogadoresModule,
              CategoriasModule
            ],
  controllers: [DesafiosController],
  providers: [DesafiosService]
})
export class DesafiosModule {}
