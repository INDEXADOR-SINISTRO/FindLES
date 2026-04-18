import { avaliarConsultaDto, consultaDto, listagemConsultaDto, metricasDto } from "@/types/consulta"
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

  async avaliar(data: avaliarConsultaDto): Promise<string> {
      return apiService.put<string, avaliarConsultaDto>(`${this.baseUrl}`, data)
    }


  async getMetricas(dataDe: string, dataAte: string): Promise<metricasDto> {
      return apiService.get<metricasDto>(`metricas?dataDe=${dataDe}&dataAte=${dataAte}`)
    }



}

export const consultaService = new ConsultaService()