import axios from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
})

// Interceptor para adicionar token automaticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      //window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient