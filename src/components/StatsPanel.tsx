import React from 'react';
import { BarChart3, Target, TrendingUp, Award, Clock } from 'lucide-react';
import { useHistorialContext } from '../contexts/HistorialContext';

interface StatsPanelProps {
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ className = '' }) => {
  const { estadisticas } = useHistorialContext();

  const stats = [
    {
      icon: Target,
      label: 'Preguntas Respondidas',
      value: estadisticas.totalPreguntas,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      icon: Award,
      label: 'Respuestas Correctas',
      value: estadisticas.respuestasCorrectas,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      label: 'Porcentaje de Aciertos',
      value: `${estadisticas.porcentajeAciertos}%`,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Tiempo Promedio',
      value: estadisticas.tiempoPromedio > 0 ? `${estadisticas.tiempoPromedio}s` : 'N/A',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Estadísticas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-100`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                <span className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <p className={`text-sm font-medium ${stat.textColor}`}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Estadísticas por dificultad */}
      {estadisticas.porDificultad && Object.keys(estadisticas.porDificultad).length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">
            Rendimiento por Dificultad
          </h4>
          <div className="space-y-3">
            {Object.entries(estadisticas.porDificultad).map(([dificultad, datos]) => {
              const porcentaje = datos.total > 0 ? Math.round((datos.correctas / datos.total) * 100) : 0;
              
              return (
                <div key={dificultad} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dificultad === 'FACIL' ? 'bg-green-100 text-green-800' :
                      dificultad === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dificultad === 'FACIL' ? 'Fácil' : dificultad === 'MEDIA' ? 'Media' : 'Difícil'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {datos.correctas}/{datos.total} correctas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          porcentaje >= 70 ? 'bg-green-500' :
                          porcentaje >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                      {porcentaje}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estadísticas por temática */}
      {estadisticas.porTematica && Object.keys(estadisticas.porTematica).length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">
            Rendimiento por Temática
          </h4>
          <div className="space-y-2">
            {Object.entries(estadisticas.porTematica)
              .sort(([,a], [,b]) => b.total - a.total)
              .slice(0, 5)
              .map(([tematica, datos]) => {
                const porcentaje = datos.total > 0 ? Math.round((datos.correctas / datos.total) * 100) : 0;
                
                return (
                  <div key={tematica} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {tematica}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({datos.total} preguntas)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            porcentaje >= 70 ? 'bg-green-500' :
                            porcentaje >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 min-w-[2.5rem]">
                        {porcentaje}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
