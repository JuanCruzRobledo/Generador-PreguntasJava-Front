// services/usuarioService.ts
import httpClient, { handleApiResponse, handleApiError } from './httpClient';
import type { Usuario } from '../types/usuario';
import type { ApiResponse } from '../types/api';

// 👤 Servicio de usuario usando httpClient centralizado
export const usuarioService = {
  
  /**
   * 🎭 Crear un usuario anónimo
   * @returns Promise<Usuario> Usuario anónimo creado
   */
  async crearUsuarioAnonimo(): Promise<Usuario> {
    try {
      const response = await httpClient.post<ApiResponse<Usuario>>('/usuarios/anonimo');
      const user = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(user));
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 👤 Obtener perfil del usuario autenticado
   * @returns Promise<Usuario> Perfil del usuario
   */
  async obtenerPerfil(): Promise<Usuario> {
    try {
      const response = await httpClient.get<ApiResponse<Usuario>>('/usuarios/perfil');
      const user = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(user));
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * ✏️ Actualizar perfil del usuario
   * @param usuarioId ID del usuario
   * @param data Datos a actualizar
   * @returns Promise<Usuario> Usuario actualizado
   */
  async actualizarPerfil(usuarioId: number, data: { nombre: string; avatar: string }): Promise<Usuario> {
    try {
      const response = await httpClient.put<ApiResponse<Usuario>>(`/usuarios/${usuarioId}/perfil`, data);
      const updatedUser = handleApiResponse(response);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * ✅ Verificar si el usuario puede usar la aplicación
   * @param usuarioId ID del usuario
   * @returns Promise<boolean> Estado de uso permitido
   */
  async puedeUsar(usuarioId: number): Promise<boolean> {
    try {
      const response = await httpClient.get<ApiResponse<boolean>>(`/usuarios/${usuarioId}/puede-usar`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 🔍 Obtener usuario por ID
   * @param id ID del usuario
   * @returns Promise<Usuario> Usuario encontrado
   */
  async obtenerPorId(id: number): Promise<Usuario> {
    try {
      const response = await httpClient.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 💾 Obtener usuario guardado en localStorage
   * @returns Usuario | null Usuario local o null si no existe
   */
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

  /**
   * 🔒 Verificar si el usuario está autenticado localmente
   * @returns boolean Estado de autenticación
   */
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

  /**
   * 🧹 Limpiar sesión local
   */
  limpiarSesion() {
    localStorage.removeItem('user_data');
  },
};
