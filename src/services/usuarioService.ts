// services/usuarioService.ts
import axios, { type AxiosResponse } from 'axios';
import type { Usuario } from '../types/usuario';

// Axios instance
const usuarioAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipo de respuesta estándar del backend
type ApiResponse<T> = {
  exitoso: boolean;
  mensaje: string;
  datos: T;
  timestamp?: string;
};

// Helpers
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.exitoso) {
    return response.data.datos;
  } else {
    throw new Error(response.data.mensaje || 'Error en la API');
  }
};

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

// Servicio de usuario
export const usuarioService = {
  async crearUsuarioAnonimo(): Promise<Usuario> {
    try {
      const response = await usuarioAPI.post<ApiResponse<Usuario>>('/usuarios/anonimo');
      const user = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(user));
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerPerfil(): Promise<Usuario> {
    try {
      const response = await usuarioAPI.get<ApiResponse<Usuario>>('/usuarios/perfil');
      const user = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(user));
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async actualizarPerfil(usuarioId: number, data: { nombre: string; avatar: string }): Promise<Usuario> {
    try {
      const response = await usuarioAPI.put<ApiResponse<Usuario>>(`/usuarios/${usuarioId}/perfil`, data);
      const updatedUser = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async puedeUsar(usuarioId: number): Promise<boolean> {
    try {
      const response = await usuarioAPI.get<ApiResponse<boolean>>(`/usuarios/${usuarioId}/puede-usar`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async obtenerPorId(id: number): Promise<Usuario> {
    try {
      const response = await usuarioAPI.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  obtenerUsuarioLocal(): Usuario | null {
    const user = localStorage.getItem('user_data');

    if (!user || user === 'undefined') return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error al parsear user_data desde localStorage:', error);
      return null;
    }
  },

  estaAutenticado(): boolean {
    const user = localStorage.getItem('user_data');

    if (!user) return false;

    try {
      const usuario = JSON.parse(user);
      return !!usuario?.id;
    } catch {
      return false;
    }
  },

  limpiarSesion() {
    localStorage.removeItem('user_data');
  },
};