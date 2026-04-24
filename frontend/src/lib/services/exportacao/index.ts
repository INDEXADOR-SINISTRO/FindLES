import { apiService } from '../apiService'

class ExportacaoService {
  private readonly baseUrl = '/exportar'

 
  async baixarRelatorio(entidade: string, tipoExportacao: string, filters?: Record<string, any> ): Promise<void> {
    const url = `${this.baseUrl}/${entidade}/${tipoExportacao}`
    const nomeArquivo = `relatorio_${entidade}.${tipoExportacao.toLowerCase()}`
    
    await apiService.downloadFile(url, nomeArquivo, filters )
  }

  
  
}

export const exportacaoService = new ExportacaoService()