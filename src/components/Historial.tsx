import React, { useState } from 'react'
import { History, RefreshCw } from 'lucide-react'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import PreguntaCard from './PreguntaCard'
import FilterPanel from './FilterPanel'
import StatsPanel from './StatsPanel'
import { useHistorialContext } from '../contexts/HistorialContext'

export const Historial: React.FC = () => {
  const {
    preguntas,
    isLoading,
    error,
    refrescar,
    limpiarError,
    totalPreguntas,
    totalTematicas,
    estaVacio,
  } = useHistorialContext()

  // Estado para manejar las respuestas seleccionadas en el historial
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<
    Record<string, string>
  >({})

  // Función para manejar la selección de respuestas
  const handleRespuestaSeleccionada = (
    preguntaId: number,
    respuesta: string
  ) => {
    setRespuestasSeleccionadas(prev => ({
      ...prev,
      [preguntaId]: respuesta,
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Historial de Preguntas
            </h1>
            <p className="text-gray-600">
              {totalPreguntas} preguntas generadas • {totalTematicas} temáticas
              registradas
            </p>
          </div>
        </div>
        <Button onClick={refrescar} variant="outline" isLoading={isLoading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onClose={limpiarError} />}

      {/* Estadísticas */}
      <StatsPanel />

      {/* Panel de filtros */}
      <FilterPanel />

      {/* Lista de preguntas */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando preguntas..." />
      ) : estaVacio ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay preguntas aún
          </h3>
          <p className="text-gray-600">
            Genera tu primera pregunta para comenzar
          </p>
        </div>
      ) : preguntas.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda o ajusta los filtros
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {preguntas.map(pregunta => (
            <PreguntaCard
              key={pregunta.id}
              pregunta={pregunta}
              respuestaSeleccionada={
                respuestasSeleccionadas[pregunta.id] || null
              }
              onRespuestaSeleccionada={respuesta =>
                handleRespuestaSeleccionada(pregunta.id, respuesta)
              }
              mostrarRespuestaCorrecta={!!respuestasSeleccionadas[pregunta.id]}
              isDisabled={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Historial
