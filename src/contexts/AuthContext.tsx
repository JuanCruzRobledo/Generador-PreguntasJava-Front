import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import authService, { type AuthUser, type LoginRequest, type RegisterRequest } from '../services/authService';

// 🔐 Tipos para el contexto de autenticación
interface AuthContextType {
  // 👤 Estado del usuario
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 🚀 Funciones de autenticación
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  
  // 📊 Estadísticas y utilidades
  getAuthStats: () => object;
}

// 🏭 Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔧 Props del proveedor de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

// 🛡️ Proveedor de autenticación principal
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 📊 Estados locales
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔄 Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // 🔄 Función para refrescar el estado de autenticación
  const refreshAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authenticatedUser = await authService.verifyAuth();
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error al verificar autenticación:', err);
      setUser(null);
      setError('Error al verificar la sesión');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 🚀 Función para iniciar sesión
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authenticatedUser = await authService.login(credentials);
      setUser(authenticatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 📝 Función para registrar usuario
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newUser = await authService.register(userData);
      setUser(newUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 🚪 Función para cerrar sesión
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.logout();
      setUser(null);
    } catch (err) {
      // 🔥 Limpiar estado local aunque falle el logout del backend
      console.error('Error al cerrar sesión:', err);
      setUser(null);
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 📊 Función para obtener estadísticas
  const getAuthStats = useCallback(() => {
    return {
      isAuthenticated: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
      userRole: user?.rol || null,
      isLoading,
      hasError: !!error,
      lastError: error,
    };
  }, [user, isLoading, error]);
  
  // 🎧 Efectos para manejar eventos personalizados
  useEffect(() => {
    // 🎯 Listener para login exitoso
    const handleLoginSuccess = (event: CustomEvent) => {
      const userData = event.detail as AuthUser;
      setUser(userData);
      setError(null);
    };
    
    // 🎯 Listener para registro exitoso
    const handleRegisterSuccess = (event: CustomEvent) => {
      const userData = event.detail as AuthUser;
      setUser(userData);
      setError(null);
    };
    
    // 🎯 Listener para logout exitoso
    const handleLogoutSuccess = () => {
      setUser(null);
      setError(null);
    };
    
    // 🎯 Listener para token expirado
    const handleTokenExpired = () => {
      setUser(null);
      setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    };
    
    // 🎯 Listener para OAuth2 exitoso
    const handleOAuth2Success = (event: CustomEvent) => {
      const userData = event.detail as AuthUser;
      setUser(userData);
      setError(null);
      setIsLoading(false);
    };
    
    // 🔧 Registrar event listeners
    window.addEventListener('auth:loginSuccess', handleLoginSuccess as EventListener);
    window.addEventListener('auth:registerSuccess', handleRegisterSuccess as EventListener);
    window.addEventListener('auth:logoutSuccess', handleLogoutSuccess);
    window.addEventListener('auth:tokenExpired', handleTokenExpired);
    window.addEventListener('auth:oauth2Success', handleOAuth2Success as EventListener);
    
    // 🧹 Cleanup
    return () => {
      window.removeEventListener('auth:loginSuccess', handleLoginSuccess as EventListener);
      window.removeEventListener('auth:registerSuccess', handleRegisterSuccess as EventListener);
      window.removeEventListener('auth:logoutSuccess', handleLogoutSuccess);
      window.removeEventListener('auth:tokenExpired', handleTokenExpired);
      window.removeEventListener('auth:oauth2Success', handleOAuth2Success as EventListener);
    };
  }, []);
  
  // 🚀 Efecto para inicializar la autenticación al montar el componente
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);
  
  // 🏗️ Valor del contexto
  const contextValue: AuthContextType = {
    // 👤 Estado del usuario
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    
    // 🚀 Funciones de autenticación
    login,
    register,
    logout,
    refreshAuth,
    clearError,
    
    // 📊 Estadísticas y utilidades
    getAuthStats,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};

// 🛡️ Hook para verificar si el usuario está autenticado
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    canAccess: isAuthenticated && !isLoading,
  };
};

// 🔐 Hook para obtener solo los datos del usuario
export const useAuthUser = () => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    user,
    isAuthenticated,
  };
};

export default AuthContext;
