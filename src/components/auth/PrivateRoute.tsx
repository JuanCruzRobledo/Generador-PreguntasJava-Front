import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// 🔐 Props para el componente PrivateRoute
interface PrivateRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
  showLoadingSpinner?: boolean;
}

/**
 * 🛡️ Componente PrivateRoute - Protege rutas que requieren autenticación
 * 
 * Características:
 * - Redirige a login si el usuario no está autenticado
 * - Muestra spinner mientras verifica la autenticación
 * - Permite especificar roles requeridos
 * - Mantiene la ruta original para redirección post-login
 * - Fallback personalizable para estados de carga
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  fallback,
  redirectTo = '/login',
  requiredRole,
  showLoadingSpinner = true,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthGuard();
  const location = useLocation();

  // 🔄 Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showLoadingSpinner) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Verificando autenticación...
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // 🚫 Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 🔒 Verificar rol requerido (si se especifica)
  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rol requerido: <span className="font-medium">{requiredRole}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu rol actual: <span className="font-medium">{user?.rol || 'Sin rol'}</span>
          </p>
        </div>
      </div>
    );
  }

  // ✅ Usuario autenticado y con permisos, mostrar contenido protegido
  return <>{children}</>;
};

// 🔐 Componente de orden superior para proteger rutas
export const withPrivateRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<PrivateRouteProps, 'children'>
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <PrivateRoute {...options}>
      <Component {...props} />
    </PrivateRoute>
  );

  WrappedComponent.displayName = `withPrivateRoute(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// 🛡️ Hook para verificar acceso a rutas protegidas
export const useRouteGuard = (requiredRole?: string) => {
  const { isAuthenticated, isLoading, user } = useAuthGuard();
  
  const hasAccess = isAuthenticated && 
    (!requiredRole || user?.rol === requiredRole);
  
  return {
    isAuthenticated,
    isLoading,
    user,
    hasAccess,
    canAccess: hasAccess && !isLoading,
    requiredRole,
    userRole: user?.rol || null,
  };
};

// 🔒 Componente para secciones que requieren autenticación
interface AuthRequiredSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string;
  showFallback?: boolean;
}

export const AuthRequiredSection: React.FC<AuthRequiredSectionProps> = ({
  children,
  fallback,
  requiredRole,
  showFallback = true,
}) => {
  const { hasAccess, isLoading } = useRouteGuard(requiredRole);
  
  if (isLoading) {
    return showFallback ? (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
    ) : null;
  }
  
  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
