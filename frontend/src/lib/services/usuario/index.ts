import { apiService, PaginatedResponse } from '../apiService'
import { UserDto, UserEditarDto } from '@/types/user' 

class UserService {
  private readonly baseUrl = '/usuarios'

  /**
   * Buscar todos com paginação
   */
  /*async getAll(
    page: number = 1,
    limit: number = 10,
    filters: string = "",
  ): Promise<PaginatedResponse<UserDto>> {
    return apiService.getPaginated<UserDto>(this.baseUrl, page, limit, filters)
  }*/

  /**
   * Buscar todos os diretores sem paginação (para selects)
   */
  async getAllSimple(): Promise<UserDto[]> {
    return apiService.get<UserDto[]>(`${this.baseUrl}`)
  }

  async getAll(
      page: number = 1,
      filters: Record<string, any> = {
          size: 10,              
          sort: 'cadastradoEm,desc'  
        },
    ): Promise<PaginatedResponse<UserDto>> {
      return apiService.getPaginated<UserDto>(this.baseUrl, page, filters)
    }

  /**
   * Buscar  por ID
   */
  async getById(id: number): Promise<UserDto> {
    return apiService.get<UserDto>(`${this.baseUrl}/${id}`)
  }

  /**
   * Criar novo 
   */
  async create(data: UserDto): Promise<UserDto> {
    return apiService.post<UserDto, UserDto>(this.baseUrl, data)
  }

  /**
   * Atualizar 
   */
  async update(id: number, data: UserEditarDto): Promise<UserDto> {
    return apiService.put<UserDto, UserEditarDto>(`${this.baseUrl}/${id}`, data)
  }

  /**
   * Deletar 
   */
  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  /**
   * Buscar por nome (autocomplete)
   */
  async searchByName(nome: string): Promise<UserDto[]> {
    return apiService.get<UserDto[]>(`${this.baseUrl}/search`, {
      params: { nome }
    })
  }
}

export const userService = new UserService()