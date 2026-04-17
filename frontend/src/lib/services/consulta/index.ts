import { consultaDto, listagemConsultaDto } from "@/types/consulta"
import { apiService, PaginatedResponse } from "../apiService"



class ConsultaService {
  private readonly baseUrl = '/consulta'


  async criarConsulta(
    consulta: {
      busca: string,
      dataDe?: string,
      dataAte?: string,
      idCategoria?: string
    }

  ): Promise<consultaDto> {
    return apiService.post<consultaDto, { busca: string, dataDe?: string, dataAte?: string, idCategoria?: string }>(this.baseUrl, consulta)
  }


  async getAll(
    page: number = 1,
    filters: Record<string, any> = {
      size: 10,
      sort: 'dataConsulta,desc'
    },
  ): Promise<PaginatedResponse<listagemConsultaDto>> {
    return apiService.getPaginated<listagemConsultaDto>(this.baseUrl, page, filters)
  }




}

export const consultaService = new ConsultaService()