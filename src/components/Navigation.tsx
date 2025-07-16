import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Play, History, BarChart3, Coffee, User, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  backendStatus: 'checking' | 'online' | 'offline';
}

export const Navigation: React.FC<NavigationProps> = ({ backendStatus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const tabs = [
    {
      to: '/generator',
      name: 'Generar',
      icon: Play,
      description: 'Crear nueva pregunta'
    },
    {
      to: '/historial',
      name: 'Historial',
      icon: History,
      description: 'Ver preguntas anteriores'
    },
    {
      to: '/stats',
      name: 'Estadísticas',
      icon: BarChart3,
      description: 'Estadísticas y temáticas'
    }
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await usuarioService.cerrarSesion();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/mi-perfil');
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case 'online':
        return 'Backend conectado';
      case 'offline':
        return 'Backend desconectado';
      case 'checking':
        return 'Verificando conexión';
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Coffee className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Java Quiz Generator
            </span>
          </div>

          {/* Navegación */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  title={tab.description}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </NavLink>
              );
            })}
          </div>

          {/* Controles de la derecha */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* Menú de usuario */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  title="Menú de usuario"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`Avatar de ${user.nombre}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.nombreParaMostrar || user.nombre}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="py-1">
                        {/* Información del usuario */}
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.nombreParaMostrar || user.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>

                        {/* Mi Perfil */}
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Mi Perfil
                        </button>

                        {/* Cerrar Sesión */}
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Indicador de backend */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getBackendStatusColor()}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{getBackendStatusText()}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
