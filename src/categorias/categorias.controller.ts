import { Controller, Post, Body, ValidationPipe, UsePipes, Get, Param, Put } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

@Controller('api/categorias')
export class CategoriasController {

    constructor(
        private readonly categoriaService: CategoriasService
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria( @Body() dto: CriarCategoriaDto ):Promise<Categoria> {
        return await this.categoriaService.criarCategoria(dto);
    }

    @Get()
    async consultarCategorias(): Promise<Array<Categoria>>{
        return await this.categoriaService.consultarTodasCategorias();
    }

    @Get('/:categoria')
    async consultarCategoriasPeloId( @Param('categoria') categoria: string ): Promise<Categoria>{
        return await this.categoriaService.consultarCategoriaPeloId( categoria );
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Body() dto: AtualizarCategoriaDto,
        @Param('categoria') categoria: string
    ): Promise<void> {
        await this.categoriaService.atualizarCategoria( categoria, dto);
    }

    @Post('/:categoria/jogadores/:idJogador')
    async atribuirCategoriaJogador(
        @Param() params: string[]
    ): Promise<void> {
        return await this.categoriaService.atribuirCategoriaJogador(params);
    }
}
