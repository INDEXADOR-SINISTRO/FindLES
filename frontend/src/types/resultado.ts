import { listagemDocumentoDto } from "./documento";

export interface resultadoDto {
    id: number;
    idConsulta: number;
    documento: listagemDocumentoDto;
    trechoEncontrado?: string;
    relevanciaScore: number;
    busca: string;
    
}