import { ArgumentMetadata, PipeTransform, Logger, BadRequestException } from "@nestjs/common";

export class ValidacaoParametrosPipe implements PipeTransform {

    private readonly logger = new Logger(ValidacaoParametrosPipe.name);

    transform(value: any, metadata: ArgumentMetadata) {

        if(!value){
            throw new BadRequestException(`O valor do parametro ${metadata.data} deve ser informado`);
        }
        
        this.logger.debug(`value: ${value} metadata: ${metadata.type}`);

        return value;
    }
}