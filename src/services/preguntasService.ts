import axios, { type AxiosResponse } from 'axios';
import type {
  ApiResponse,
  Pregunta,
  GenerarPreguntaRequest,
  ValidarRespuestaRequest,
  ValidacionResponse
} from '../types/api';

// 🛠 Base URL dinámica
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores de logging en modo desarrollo
if (import.meta.env.VITE_DEV_MODE === 'true') {
  api.interceptors.request.use(
    (config) => {
      console.log('📡 [API Request]', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('❌ [API Request Error]', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ [API Response]', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('❌ [API Response Error]', error);
      return Promise.reject(error);
    }
  );
}

// Manejo centralizado de la respuesta
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.exitoso) {
    return response.data.datos;
  }
  throw new Error(response.data.mensaje || 'Error desconocido en la API');
};

// Manejo centralizado de errores
const handleApiError = (error: any): never => {
  console.error('🔥 API Error:', error);

  if (error.response?.data?.mensaje) {
    throw new Error(error.response.data.mensaje);
  } else if (error.response?.status === 404) {
    throw new Error('Recurso no encontrado');
  } else if (error.response?.status >= 500) {
    throw new Error('Error interno del servidor');
  } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté disponible.'
    );
  } else {
    throw new Error(error.message || 'Error desconocido');
  }
};

// 🚀 Servicio para manejar operaciones con preguntas
export const preguntasService = {
  /**
   * Genera una nueva pregunta basada en los parámetros proporcionados
   * @param request - Parámetros para generar la pregunta
   * @returns Promise<Pregunta> Pregunta generada
   */
  async generarPregunta(
    request: GenerarPreguntaRequest
  ): Promise<Pregunta> {
    try {
      const response = await api.post<ApiResponse<Pregunta>>(
        '/preguntas/generar',
        request
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Valida una respuesta proporcionada por el usuario
   * @param request - Datos de la respuesta a validar
   * @returns Promise<ValidacionResponse> Resultado de la validación
   */
  async validarRespuesta(
    request: ValidarRespuestaRequest
  ): Promise<ValidacionResponse> {
    try {
      const response = await api.post<ApiResponse<ValidacionResponse>>(
        '/respuesta',
        request
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default preguntasService;
