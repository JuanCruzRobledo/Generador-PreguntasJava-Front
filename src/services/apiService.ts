import axios, { type AxiosResponse } from 'axios';
import type {
  ApiResponse,
  Pregunta,
  Tematica,
  GenerarPreguntaRequest,
  ValidarRespuestaRequest,
  ValidacionResponse
} from '../types/api';

// Configuración de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests (en desarrollo)
if (import.meta.env.VITE_DEV_MODE === 'true') {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

// Función helper para manejar respuestas de la API
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.exitoso) {
    return response.data.datos;
  } else {
    throw new Error(response.data.mensaje || 'Error en la API');
  }
};

// Función helper para manejar errores
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  if (error.response?.data?.mensaje) {
    throw new Error(error.response.data.mensaje);
  } else if (error.response?.status === 404) {
    throw new Error('Recurso no encontrado');
  } else if (error.response?.status >= 500) {
    throw new Error('Error interno del servidor');
  } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
  } else {
    throw new Error(error.message || 'Error desconocido');
  }
};

// Servicios de la API
export const apiService = {
  // Generar una nueva pregunta
  async generarPregunta(request: GenerarPreguntaRequest = {}): Promise<Pregunta> {
    try {
      const response = await api.post<ApiResponse<Pregunta>>('/preguntas/generar', request);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Validar respuesta del usuario
  async validarRespuesta(request: ValidarRespuestaRequest): Promise<ValidacionResponse> {
    try {
      const response = await api.post<ApiResponse<ValidacionResponse>>('/respuesta', request);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener todas las preguntas
  async obtenerTodasLasPreguntas(): Promise<Pregunta[]> {
    try {
      const response = await api.get<ApiResponse<Pregunta[]>>('/preguntas');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener preguntas por temática
  async obtenerPreguntasPorTematica(nombreTematica: string): Promise<Pregunta[]> {
    try {
      const encodedNombre = encodeURIComponent(nombreTematica);
      const response = await api.get<ApiResponse<Pregunta[]>>(`/preguntas/por-tematica/${encodedNombre}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener todas las temáticas
  async obtenerTodasLasTematicas(): Promise<Tematica[]> {
    try {
      const response = await api.get<ApiResponse<Tematica[]>>('/tematicas');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Verificar salud del backend
  async verificarSaludBackend(): Promise<boolean> {
    try {
      await api.get('/tematicas');
      return true;
    } catch (error) {
      console.warn('Backend no disponible:', error);
      return false;
    }
  }
};

export default apiService;
