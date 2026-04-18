


export interface consultaDto {
    id: number;
    tokens: string[];
    
}

export interface listagemConsultaDto{
    nomeUsuario: string;
    nomeCategoria?: string;
    status: string;
    tempoResposta: number;
    dataConsulta: string;
    dataDe?: string;
    dataAte?: string;
    quantidadeResultado: number;
    avaliacao?: number;
    stringBusca: string;
    erro: string;

}

export interface avaliarConsultaDto{
    avaliacao: number;
    idConsulta: number;
}

export interface metricasDto{
    totalConsultas: number;
    mediaTempoResposta: number;
    mediaResultadosBusca: number;
    consultasSemResultado: number;
    avaliacaoMedia: number;
    grafico: graficoDto[];
}

export interface graficoDto{
    totalConsultas: number;
    tempoMedio: number;
    data: string;
}