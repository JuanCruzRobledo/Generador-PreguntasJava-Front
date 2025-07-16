import axios, { type AxiosResponse } from 'axios';
import type {
  SesionRespuesta,
  EstadisticasUsuario,
  RespuestaUsuario
} from '../types/estadisticas';
import type { ApiResponse } from '../types/api';

// Axios configurado para módulo estadísticas
const estadisticasAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1/estadisticas',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

estadisticasAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

estadisticasAPI.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.exitoso) {
    return response.data.datos;
  } else {
    throw new Error(response.data.mensaje || 'Error en la API de estadísticas');
  }
};

const handleApiError = (error: any): never => {
  console.error('Estadísticas API Error:', error);
  if (error.response?.data?.mensaje) {
    throw new Error(error.response.data.mensaje);
  } else if (error.response?.status === 404) {
    throw new Error('Recurso no encontrado');
  } else if (error.response?.status >= 500) {
    throw new Error('Error interno del servidor');
  } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error(error.message || 'Error desconocido');
  }
};

export const estadisticasService = {
  async iniciarSesion(usuarioId: string, preguntaId: string): Promise<SesionRespuesta> {
    try {
      const response = await estadisticasAPI.post<ApiResponse<SesionRespuesta>>(
        `/sesiones/iniciar?usuarioId=${usuarioId}&preguntaId=${preguntaId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async responderYFinalizarSesion(
    usuarioId: string,
    preguntaId: string,
    respuesta: string
  ): Promise<RespuestaUsuario> {
    try {
      const response = await estadisticasAPI.post<ApiResponse<RespuestaUsuario>>(
        `/responder?usuarioId=${usuarioId}&preguntaId=${preguntaId}&respuesta=${respuesta}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerEstadisticasUsuario(usuarioId: number): Promise<EstadisticasUsuario> {
    try {
      const response = await estadisticasAPI.get<ApiResponse<EstadisticasUsuario>>(
        `/usuario/${usuarioId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerEstadisticasPorDificultad(usuarioId: string) {
    try {
      const response = await estadisticasAPI.get<ApiResponse<any>>(
        `/usuario/${usuarioId}/dificultades`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerEstadisticasPorTematica(usuarioId: string) {
    try {
      const response = await estadisticasAPI.get<ApiResponse<any>>(
        `/usuario/${usuarioId}/tematicas`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerResumenProgreso(usuarioId: string) {
    try {
      const response = await estadisticasAPI.get<ApiResponse<any>>(
        `/usuario/${usuarioId}/resumen`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerRankingGlobal(limite = 10) {
    try {
      const response = await estadisticasAPI.get<ApiResponse<any>>(
        `/ranking?limite=${limite}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async verificarConexion(): Promise<boolean> {
    try {
      await estadisticasAPI.get('/health');
      return true;
    } catch (error) {
      console.warn('Estadísticas no disponibles:', error);
      return false;
    }
  },
};

export default estadisticasService;
