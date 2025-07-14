import React from 'react';
import { NavLink } from 'react-router-dom';
import { Play, History, BarChart3, Coffee } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

interface NavigationProps {
  backendStatus: 'checking' | 'online' | 'offline';
}

export const Navigation: React.FC<NavigationProps> = ({ backendStatus }) => {
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
