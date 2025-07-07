import React from 'react';
import { NavLink } from 'react-router-dom';
import { Play, History, BarChart3, Coffee } from 'lucide-react';

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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Coffee className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-xl font-bold text-gray-900">
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
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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

          {/* Indicador de backend */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getBackendStatusColor()}`}></div>
            <span className="text-xs text-gray-500">{getBackendStatusText()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
