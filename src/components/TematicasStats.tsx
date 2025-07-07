import React, { useMemo } from 'react'
import { BarChart3, TrendingUp, Hash, Calendar } from 'lucide-react'
import { useEstadisticas } from '../hooks/useEstadisticas'
import Button from './ui/Button'
import ErrorAlert from './ui/ErrorAlert'
import LoadingSpinner from './ui/LoadingSpinner'
import { useUserContext } from '../contexts/UserContext'

export const TematicasStats: React.FC = () => {
  const { usuario } = useUserContext()
  const usuarioId = usuario?.id

  const { estadisticas, isLoading, error, refrescar } = useEstadisticas(
    usuarioId!
  )

  // Transforma porTematica (Record) a un array ordenado
  const tematicas = useMemo(() => {
    if (!estadisticas) return []
    return Object.entries(estadisticas.porTematica).map(([nombre, datos]) => ({
      id: nombre, // ID ficticio basado en el nombre
      nombre,
      total: datos.total,
      correctas: datos.correctas,
    }))
  }, [estadisticas])

  // Ordenar por total de preguntas
  const tematicasOrdenadas = useMemo(() => {
    return [...tematicas].sort((a, b) => b.total - a.total)
  }, [tematicas])

  // Temática más usada
  const tematicaMasUsada = tematicasOrdenadas[0]

  // Calcular promedio de usos
  const promedioUsos = useMemo(() => {
    if (tematicas.length === 0) return 0
    const suma = tematicas.reduce((acc, t) => acc + t.total, 0)
    return Math.round((suma / tematicas.length) * 10) / 10
  }, [tematicas])

  // Total preguntas
  const totalPreguntas = estadisticas?.totalPreguntas ?? 0

  // Total temáticas
  const totalTematicas = tematicas.length

  // Si tienes navegación a preguntas por temática (esto es opcional, o podrías remover)
  const cargarPreguntasPorTematica = (nombreTematica: string) => {
    // Aquí podrías navegar a una ruta filtrada o hacer algo con esa temática
    console.log(`Ver preguntas de temática: ${nombreTematica}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header con botón de refrescar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Estadísticas de Temáticas
            </h1>
            <p className="text-gray-600">
              Análisis de las temáticas más utilizadas en las preguntas
              generadas
            </p>
          </div>
        </div>
        <Button onClick={refrescar} variant="outline" isLoading={isLoading}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Mostrar errores si existen */}
      {error && <ErrorAlert error={error} onClose={() => {}} />}

      {/* Estadísticas generales en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Hash className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Preguntas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPreguntas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Temáticas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalTematicas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Promedio de Usos
              </p>
              <p className="text-2xl font-bold text-gray-900">{promedioUsos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Más Popular</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {tematicaMasUsada?.nombre || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cargando o sin datos */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando estadísticas..." />
      ) : tematicas.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay temáticas registradas
          </h3>
          <p className="text-gray-600">
            Genera algunas preguntas para ver las estadísticas
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Ranking de Temáticas por Uso
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {tematicasOrdenadas.map((tematica, index) => {
              const porcentaje =
                totalPreguntas > 0
                  ? Math.round((tematica.total / totalPreguntas) * 100)
                  : 0

              return (
                <div
                  key={tematica.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Ranking visual con colores */}
                      <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : index === 1
                            ? 'bg-gray-100 text-gray-800'
                            : index === 2
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      `}
                      >
                        {index + 1}
                      </div>

                      {/* Detalles de temática */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 capitalize">
                          {tematica.nombre}
                        </h3>
                        {/*tematica.timestamp_ultimo_uso && (
                          <p className="text-sm text-gray-500">
                            Último uso:{' '}
                            {formatearFecha(tematica.timestamp_ultimo_uso)}
                          </p>
                        )*/}
                      </div>
                    </div>

                    {/* Estadísticas de la temática */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(porcentaje, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 min-w-[3rem]">
                          {porcentaje}%
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {tematica.total}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tematica.total === 1 ? 'uso' : 'usos'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Información adicional */}
      {tematicas.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Información
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              • Las temáticas se generan automáticamente basándose en el
              contenido de las preguntas
            </p>
            <p>
              • El porcentaje indica qué tan frecuentemente aparece cada
              temática
            </p>
            <p>
              • Las temáticas con mayor uso indican los temas más practicados
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TematicasStats
