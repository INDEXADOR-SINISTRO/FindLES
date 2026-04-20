import { apiService, PaginatedResponse } from '../apiService'
import { emailRecoverPasswordDto, redefinirSenhaDto, UserDto, UserEditarDto } from '@/types/user' 

class UserService {
  private readonly baseUrl = '/usuarios'

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

  async getById(id: number): Promise<UserDto> {
    return apiService.get<UserDto>(`${this.baseUrl}/${id}`)
  }


  async create(data: UserDto): Promise<UserDto> {
    return apiService.post<UserDto, UserDto>(this.baseUrl, data)
  }


  async update(id: number, data: UserEditarDto): Promise<UserDto> {
    return apiService.put<UserDto, UserEditarDto>(`${this.baseUrl}/${id}`, data)
  }


  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`)
  }


  async sendEmail(data: emailRecoverPasswordDto): Promise<string> {
    return apiService.post<string, emailRecoverPasswordDto>(this.baseUrl + "/recover", data)
  }

  async redefinirSenha(token:string,data: redefinirSenhaDto): Promise<string> {
    return apiService.put<string, redefinirSenhaDto>(`${this.baseUrl}?token=${token}`, data)
  }
}

export const userService = new UserService()