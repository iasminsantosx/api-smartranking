import { ArgumentMetadata, PipeTransform, Logger, BadRequestException } from "@nestjs/common";

export class JogadoresValidacaoParametrosPipe implements PipeTransform {

    private readonly logger = new Logger(JogadoresValidacaoParametrosPipe.name);

    transform(value: any, metadata: ArgumentMetadata) {

        if(!value){
            throw new BadRequestException(`O valor do parametro ${metadata.data} deve ser informado`);
        }
        
        this.logger.debug(`value: ${value} metadata: ${metadata.type}`);

        return value;
    }
}