import { consultaDto } from "@/types/consulta"
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
    return apiService.post<consultaDto,{busca: string, dataDe?: string, dataAte?: string, idCategoria?: string}>(this.baseUrl,consulta)
  }
  

  


}

export const consultaService = new ConsultaService()