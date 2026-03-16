import apiClient from '@/lib/utils/axios'
import { AxiosError, AxiosRequestConfig } from 'axios'


export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: object;
  config: AxiosRequestConfig;
  request?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class ApiService {
  /**
   * Requisição GET genérica
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response : any= await apiClient.get<ApiResponse<T>>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição POST genérica
   */
  async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição PUT genérica
   */
  async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição PATCH genérica
   */
  async patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição DELETE genérica
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config)
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição GET com paginação
   */
  async getPaginated<T>(
    url: string,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    try {
      const params = {
        page,
        limit,
        ...filters,
      }
      const response = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(
        url,
        { params }
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload de arquivo
   */
  async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>
  ): Promise<T> {
    try {
      const formData = new FormData()
      formData.append(fieldName, file)

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key])
        })
      }

      const response = await apiClient.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Download de arquivo
   */
  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(link.href)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Ocorreu um erro na requisição'
      
      
      return new Error(message)
    }
    
    return new Error('Erro desconhecido')
  }
}

export const apiService = new ApiService()