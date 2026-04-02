import { listagemDocumentoDto } from '@/types/documento'
import { apiService, PaginatedResponse } from '../apiService'
import { AuditoriaDto } from '@/types/auditoria'
// Importe o seu DTO de documento se você tiver um
// import { DocumentDto } from '@/types/document'

class AuditoriaService {
  private readonly baseUrl = '/auditoria' 

  

  async getAll(
    page: number = 1,
    filters: Record<string, any> = {
        size: 10,              
        sort: 'data,desc'  
      },
  ): Promise<PaginatedResponse<AuditoriaDto>> {
    return apiService.getPaginated<AuditoriaDto>(this.baseUrl, page, filters)
  }

  


}

export const auditoriaService = new AuditoriaService()