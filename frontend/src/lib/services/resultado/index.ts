import { resultadoDto } from "@/types/resultado"
import { apiService, PaginatedResponse } from "../apiService"



class ResultadoService {
  private readonly baseUrl = '/resultado' 

  
async getAll(
    page: number = 1,
    filters: Record<string, any> = {
      size: 10,
      sort: 'relevanciaScore,desc'
    },
  ): Promise<PaginatedResponse<resultadoDto>> {
    return apiService.getPaginated<resultadoDto>(this.baseUrl, page, filters)
  }
  

  


}

export const resultadoService = new ResultadoService()