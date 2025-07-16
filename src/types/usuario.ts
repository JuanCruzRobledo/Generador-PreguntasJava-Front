// Tipos relacionados con usuario y autenticación OAuth2
export interface Usuario {
  id: number;
  googleId: string;
  email: string;
  nombre: string;
  avatar?: string;
  fechaRegistro?: string;
  ultimoAcceso?: string;
  activo?: boolean;
  nombreParaMostrar?: string;
}

// Estado de autenticación
export interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Respuesta del login OAuth2
export interface LoginResponse {
  usuario: Usuario;
  token: string;
  expiresIn: number;
}

// Request para actualizar perfil
export interface ActualizarPerfilRequest {
  nombre?: string;
  avatar?: string;
}
