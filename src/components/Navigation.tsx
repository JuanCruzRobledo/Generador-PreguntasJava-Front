import React from 'react';
import { Play, History, BarChart3, Coffee } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'generar',
      name: 'Generar',
      icon: Play,
      description: 'Crear nueva pregunta'
    },
    {
      id: 'historial',
      name: 'Historial',
      icon: History,
      description: 'Ver preguntas anteriores'
    },
    {
      id: 'tematicas',
      name: 'Temáticas',
      icon: BarChart3,
      description: 'Estadísticas y temáticas'
    }
  ];

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
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
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
                </button>
              );
            })}
          </div>

          {/* Indicador de backend */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Backend conectado</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
