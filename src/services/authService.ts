import httpClient, { handleApiResponse, handleApiError } from './httpClient';
import type { ApiResponse } from '../types/api';

// 🔐 Tipos para las peticiones de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: string;
  avatar?: string;
  fechaRegistro: string;
  ultimoAcceso?: string;
  activo?: boolean;
  nombreParaMostrar?: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

// 🔒 Servicio centralizado de autenticación
export const authService = {
  
  /**
   * 🚀 Inicia sesión con email y contraseña
   * Los tokens se almacenan automáticamente en cookies HttpOnly
   */
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await httpClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      const authData = handleApiResponse(response);
      
      // 🎯 Disparar evento personalizado para notificar al AuthContext
      window.dispatchEvent(new CustomEvent('auth:loginSuccess', { 
        detail: authData.user 
      }));
      
      return authData.user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 📝 Registra un nuevo usuario
   */
  async register(userData: RegisterRequest): Promise<AuthUser> {
    try {
      const response = await httpClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
      const authData = handleApiResponse(response);
      
      // 🎯 Disparar evento personalizado para notificar al AuthContext
      window.dispatchEvent(new CustomEvent('auth:registerSuccess', { 
        detail: authData.user 
      }));
      
      return authData.user;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 🚪 Cierra sesión del usuario
   * Invalida las cookies HttpOnly en el backend
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post<ApiResponse<void>>('/auth/logout');
      
      // 🎯 Disparar evento personalizado para notificar al AuthContext
      window.dispatchEvent(new CustomEvent('auth:logoutSuccess'));
    } catch (error) {
      // 🔥 Aunque falle el logout del backend, limpiar el estado local
      console.error('Error al cerrar sesión en el backend:', error);
      window.dispatchEvent(new CustomEvent('auth:logoutSuccess'));
    }
  },

  /**
   * 🔄 Renueva el access token usando el refresh token
   * Se llama automáticamente desde el interceptor de httpClient
   */
  async refreshToken(): Promise<void> {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/auth/refresh');
      const data = handleApiResponse(response);
      
      // 🎯 El token se actualiza automáticamente en las cookies HttpOnly
      return data;
    } catch (error) {
      // 🔥 Si falla el refresh, disparar evento de token expirado
      window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
      return handleApiError(error);
    }
  },

  /**
   * 👤 Obtiene el perfil del usuario autenticado
   */
  async getProfile(): Promise<AuthUser> {
    try {
      const response = await httpClient.get<ApiResponse<AuthUser>>('/auth/profile');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * ✅ Verifica si el usuario está autenticado
   * Hace una petición al backend para validar el token
   */
  async verifyAuth(): Promise<AuthUser | null> {
    try {
      const localUser = localStorage.getItem('user_data');
      if (localUser) {
        return JSON.parse(localUser);
      }

      // fallback por si no está en localStorage
      const response = await httpClient.get<ApiResponse<AuthUser>>('/auth/me');
      console.log('🚨 verifyAuth raw response:', response);
      const user = handleApiResponse(response);

      if (user) {
        localStorage.setItem('user_data', JSON.stringify(user));
        return user;
      }

      return null;
    } catch (error) {
      console.error('verifyAuth error:', error);
      return null;
    }
  },

  /**
   * 🔐 Inicia el flujo OAuth2 con Google
   * Redirige al usuario a la página de autorización de Google
   */
  initiateGoogleOAuth(): void {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/v1$/, ''); 
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  },
  /**
   * 🔄 Verifica el estado de autenticación después de OAuth2
   * Se llama cuando el usuario regresa desde el flujo OAuth2
   */
  async checkOAuth2Status(): Promise<AuthUser | null> {
    try {
      const response = await httpClient.get<ApiResponse<AuthUser>>('/auth/me');
      console.log('🚨 checkOAuth2Status raw response:', response);
      const user = handleApiResponse(response);

      if (user) {
        // 💾 Guardar en localStorage para que el front detecte autenticación
        localStorage.setItem('user_data', JSON.stringify(user));

        // 🎯 Disparar evento personalizado para notificar al AuthContext
        window.dispatchEvent(new CustomEvent('auth:oauth2Success', { 
          detail: user 
        }));
      }
      return user;
    } catch (error) {
      console.error('checkOAuth2Status error:', error);
      // 🔥 Si falla la verificación, el usuario no está autenticado
      return null;
    }
  },

  /**
   * 🔐 Cambia la contraseña del usuario
   */
  async changePassword(data: { 
    currentPassword: string; 
    newPassword: string; 
  }): Promise<void> {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/auth/change-password', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 📧 Solicita un enlace de recuperación de contraseña
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 🔄 Resetea la contraseña usando un token de recuperación
   */
  async resetPassword(data: { 
    token: string; 
    newPassword: string; 
  }): Promise<void> {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/auth/reset-password', data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 📊 Obtiene estadísticas del servicio de autenticación
   */
  getStats() {
    return {
      serviceName: 'authService',
      endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        profile: '/auth/profile',
        verify: '/auth/verify',
        changePassword: '/auth/change-password',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
      },
    };
  },

  /**
   * 🎭 Crea un usuario anónimo y devuelve sus datos
   */
  async crearUsuarioAnonimo(): Promise<AuthUser> {
    try {
      const response = await httpClient.post<ApiResponse<AuthUser>>('/auth/invitado');
      const user = handleApiResponse(response);

      // 💾 Guardar en localStorage
      localStorage.setItem('user_data', JSON.stringify(user));

      // 🎯 Notificar al AuthContext
      window.dispatchEvent(new CustomEvent('auth:loginSuccess', { 
        detail: user 
      }));

      return user;
    } catch (error) {
      return handleApiError(error);
    }
  }

};

export default authService;
