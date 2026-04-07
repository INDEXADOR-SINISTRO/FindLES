import { documentoDto, listagemDocumentoDto } from '@/types/documento'
import { apiService, PaginatedResponse } from '../apiService'
// Importe o seu DTO de documento se você tiver um
// import { DocumentDto } from '@/types/document'

class DocumentoService {
  private readonly baseUrl = '/documentos'

  /**
   * Enviar novos documentos para o servidor (Upload)
   */
  async upload(arquivos: File[], idCategoria?: number | null): Promise<any> {

    // 1. Instancia o pacote FormData
    const formData = new FormData()

    // 2. Adiciona os arquivos (o nome 'arquivos' tem que bater com o @RequestParam do Java)
    arquivos.forEach((arquivo) => {
      formData.append('arquivos', arquivo)
    })

    // 3. Adiciona a categoria
    if (idCategoria !== undefined && idCategoria !== null) {
      formData.append('idCategoria', String(idCategoria))
    }

    // 4. Envia via POST
    // O Axios detecta o FormData automaticamente, mas é boa prática forçar o header
    // *Nota: Verifique se o seu 'apiService.post' aceita um terceiro parâmetro de configuração (headers).
    return apiService.post<any, FormData>(`${this.baseUrl}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async editar(idDoc: number, arquivo: File[], titulo: string, idCategoria?: number | null): Promise<any> {

    // 1. Instancia o pacote FormData
    const formData = new FormData()

    // 2. Adiciona os arquivos (o nome 'arquivos' tem que bater com o @RequestParam do Java)
    if (arquivo[0] !== undefined && arquivo[0] !== null) {
      formData.append('arquivo', arquivo[0])
    }

    // 3. Adiciona a categoria
    if (idCategoria !== undefined && idCategoria !== null && idCategoria !== 0) {
      formData.append('idCategoria', String(idCategoria))
    }

    formData.append('titulo', titulo)

    return apiService.put<any, FormData>(`${this.baseUrl}/editar/${idDoc}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }


  /**
   * Buscar todos os documentos de uma categoria
   */
  async getByCategoria(idCategoria: number): Promise<any[]> {
    return apiService.get<any[]>(`${this.baseUrl}/categoria/${idCategoria}`)
  }

  /**
   * Deletar documento
   */
  async delete(id: number): Promise<string> {
    return apiService.delete<string>(`${this.baseUrl}/remover/${id}`)
  }

  async getAll(
    page: number = 1,
    filters: Record<string, any> = {
      size: 10,
      sort: 'criadoEm,desc'
    },
  ): Promise<PaginatedResponse<listagemDocumentoDto>> {
    return apiService.getPaginated<listagemDocumentoDto>(this.baseUrl, page, filters)
  }

  async getById(id: number): Promise<listagemDocumentoDto> {
    return apiService.get<listagemDocumentoDto>(this.baseUrl + "/" + String(id))
  }

  async getHistoricoById(id: number): Promise<listagemDocumentoDto[]> {
    return apiService.get<listagemDocumentoDto[]>(this.baseUrl + "/historico/" + String(id))
  }

  async AbrirDocumento(id: number): Promise<void> {
    return apiService.openFile(this.baseUrl + "/abrir/" + String(id))
  }

  async restaurarDocumento(id:number, idDocAtual: number): Promise<string> {
    return apiService.post<string, number>(this.baseUrl + `/restaurar/${id}`, idDocAtual,{
    headers: {
        'Content-Type': 'application/json' // AQUI ESTÁ A CORREÇÃO!
    },
    data: JSON.stringify({ idDocAtual: idDocAtual })
})
  }


  async indexarDocumentos(): Promise<string> {
    return apiService.post<string, any>(this.baseUrl + "/indexar-pendentes")
  }

  async calcularTfIdf(): Promise<string> {
    return apiService.post<string, any>(this.baseUrl + "/calcular-tfidf")
  }
}

export const documentoService = new DocumentoService()