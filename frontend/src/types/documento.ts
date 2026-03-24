import { UserDto } from "./user";

export interface categoriaDto {
    id: number;
    nome: string;
    descricao: string;
}

export interface statusDocumentoDto {
    id: number;
    nome: string;
    descricao: string;
}

export const StatusDocumentList = [
  { value: 1, descricao: "Ativo" },
  { value: 2, descricao: "Inativo" },
];

export const CategoriaList = [
  { value: 1, descricao: "Relatório" },
  { value: 2, descricao: "Financeiro" },
  { value: 3, descricao: "Recursos Humanos" },
  { value: 4, descricao: "Jurídico" },
  { value: 5, descricao: "Contratos" },
  { value: 6, descricao: "TI e Sistemas" },
  { value: 7, descricao: "Comercial" }
];

export interface documentoDto {
    id?: number;
    categoria?: categoriaDto;
    inseridoPor: UserDto;
    documentoOrigem: documentoDto;
    StatusDoc: statusDocumentoDto;
    caminhoArquivo: string;
    titulo: string;
    atualizadoEm: Date;
    criadoEm: Date;
    hashConteudo: string;
    numeroVersao: string;
}