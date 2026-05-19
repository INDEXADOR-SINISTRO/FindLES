import apiClient from '@/lib/utils/axios'
import { AxiosError, AxiosRequestConfig } from 'axios'


export interface ApiResponse<T> {
  content: T;
  status: number;
  statusText: string;
  headers: object;
  config: AxiosRequestConfig;
  request?: unknown;
}

export interface PaginatedResponse<T> {
  content: T[]
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
}

class ApiService {
  /**
   * Requisição GET genérica
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: any = await apiClient.get<ApiResponse<T>>(url, config)
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
      const response = await apiClient.post<T>(url, data, config)
      return response.data
    } catch (error) {
      console.log(error)
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
      const response = await apiClient.put<T>(url, data, config)
      return response.data
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
      return response.data.content
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Requisição DELETE genérica
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config)
      return response.data
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
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    try {
      const params = {
        page,
        ...filters,
      }
      const response = await apiClient.get<PaginatedResponse<T>>(
        url,
        { params }
      )
      return response.data
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
      return response.data.content
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

  async openFile(url: string): Promise<void> {
    try {
      // Faz a requisição enviando o seu Token JWT (o apiClient já faz isso)
      const response = await apiClient.get(url, {
        responseType: 'blob', // Importante: diz ao Axios que é um arquivo, não um JSON
      })

      // Cria um link temporário na memória do navegador com o arquivo
      const file = new Blob([response.data], { type: response.headers['content-type'] })
      const fileURL = window.URL.createObjectURL(file)

      // Abre esse link temporário em uma nova aba!
      window.open(fileURL, '_blank')

      // Opcional: Limpa a memória depois de um tempo
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000)

    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {

    

      let mensagemPersonalizada = '';
      const dadosErro = error.response?.data;

      // 2. Verifica se o backend mandou apenas uma String limpa
      if (typeof dadosErro === 'string') {
        mensagemPersonalizada = dadosErro;
      }
      // 3. Verifica se é um objeto JSON e tenta pegar as chaves mais comuns
      else if (dadosErro && typeof dadosErro === 'object') {
        mensagemPersonalizada =
          dadosErro.message || // O que você já tentava
          dadosErro.error ||   // Padrão do Spring Boot
          dadosErro.detail ||  // Padrão RFC 7807 (Problem Details)
          '';
      }

      // 4. Monta a mensagem final: 
      // Pega a personalizada. Se não achar, cai pro padrão do Axios.
      const message = mensagemPersonalizada || error.message || 'Ocorreu um erro na requisição';

      return new Error(message);
    }

    return new Error('Erro desconhecido');
  }
}

export const apiService = new ApiService()