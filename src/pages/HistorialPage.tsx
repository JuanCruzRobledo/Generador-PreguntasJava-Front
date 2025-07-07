import React, { useEffect } from 'react'
import Historial from '../components/Historial'
import { useHistorialContext } from '../contexts/HistorialContext'

export default function HistorialPage() {
  const {
    preguntas: historial,
    tematicas,
    isLoading: historialLoading,
    cargarPreguntas: loadHistorial,
    aplicarFiltroTematica: filterHistorial,
  } = useHistorialContext()

  useEffect(() => {
    loadHistorial()
  }, [loadHistorial])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial de Preguntas
        </h1>
        <p className="text-gray-600">
          Revisa las preguntas que has respondido anteriormente
        </p>
      </div>

      <Historial
        historial={historial}
        tematicas={tematicas}
        isLoading={historialLoading}
        onFilter={filterHistorial}
      />
    </div>
  )
}
