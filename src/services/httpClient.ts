import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/api';

// 🌐 Configuración centralizada de variables de entorno
const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
};

// 🔧 Instancia principal de Axios con configuración para cookies HttpOnly
const httpClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // 🍪 Habilita envío automático de cookies HttpOnly/Secure
});

// 📝 Variable para rastrear si ya se intentó el refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

// 🔄 Función para procesar la cola de peticiones fallidas
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 📡 Interceptor de peticiones - Logging en desarrollo
if (CONFIG.DEV_MODE) {
  httpClient.interceptors.request.use(
    (config) => {
      console.log('📡 [HTTP Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        timeout: config.timeout,
        withCredentials: config.withCredentials,
      });
      return config;
    },
    (error) => {
      console.error('❌ [HTTP Request Error]', error);
      return Promise.reject(error);
    }
  );
}

// 📥 Interceptor de respuestas - Manejo de refresh token automático
httpClient.interceptors.response.use(
  (response) => {
    // 🎯 Logging en desarrollo
    if (CONFIG.DEV_MODE) {
      console.log('✅ [HTTP Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 🔒 Si recibimos un 401 (Unauthorized), intentar refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/me') // ⛔ Evitar refresh si estamos verificando autenticación
    ) {
      if (isRefreshing) {
        // 🔄 Ya se está haciendo refresh: agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return httpClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await httpClient.post('/auth/refresh');

        if (refreshResponse.data.exitoso) {
          processQueue(null, 'refreshed');
          return httpClient(originalRequest);
        } else {
          processQueue(error, null);
          window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🚨 Logging de errores en desarrollo
    if (CONFIG.DEV_MODE) {
      console.error('❌ [HTTP Response Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// 🛠 Helper para manejar respuestas exitosas de la API
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.exitoso) {
    return response.data.datos;
  }
  throw new Error(response.data.mensaje || 'Error desconocido en la API');
};

// 🔥 Helper para manejar errores de la API con tipos específicos
export const handleApiError = (error: any): never => {
  console.error('🔥 [API Error]', error);
  
  // 📝 Error con mensaje del backend
  if (error.response?.data?.mensaje) {
    throw new Error(error.response.data.mensaje);
  }
  
  // 🔍 Errores por código de estado HTTP
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        throw new Error('Solicitud incorrecta. Revisa los datos enviados.');
      case 401:
        throw new Error('No autorizado. Por favor, inicia sesión.');
      case 403:
        throw new Error('Acceso denegado. No tienes permisos para esta acción.');
      case 404:
        throw new Error('Recurso no encontrado.');
      case 409:
        throw new Error('Conflicto. El recurso ya existe.');
      case 422:
        throw new Error('Datos inválidos. Revisa la información enviada.');
      case 429:
        throw new Error('Demasiadas peticiones. Intenta de nuevo más tarde.');
      case 500:
        throw new Error('Error interno del servidor.');
      case 502:
        throw new Error('Error en el servidor. Intenta de nuevo más tarde.');
      case 503:
        throw new Error('Servicio no disponible temporalmente.');
      default:
        throw new Error(`Error HTTP ${error.response.status}: ${error.response.statusText}`);
    }
  }
  
  // 🌐 Errores de red
  if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
  }
  
  // ⏱️ Timeout
  if (error.code === 'ECONNABORTED') {
    throw new Error('La petición tardó demasiado tiempo. Intenta de nuevo.');
  }
  
  // 🔄 Error genérico
  throw new Error(error.message || 'Error desconocido');
};

// 🔧 Función para crear peticiones con configuración personalizada
export const createRequest = <T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  return httpClient.request<ApiResponse<T>>(config);
};

// 📊 Función para obtener estadísticas de la instancia (útil para debugging)
export const getHttpClientStats = () => {
  return {
    baseURL: CONFIG.API_BASE_URL,
    timeout: CONFIG.API_TIMEOUT,
    withCredentials: true,
    isRefreshing,
    queueLength: failedQueue.length,
  };
};

export default httpClient;
