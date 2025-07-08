import React from 'react'
import { Filter, Search, X } from 'lucide-react'
import { useHistorialContext } from '../contexts/HistorialContext'
import { Dificultad } from '../types/api'
import { usePreguntaContext } from '../contexts/PreguntaContext'

interface FilterPanelProps {
  className?: string
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = '' }) => {
  const {
    tematica,
    dificultad,
    textoBusqueda,
    filtroActivo,
    setTematica,
    setDificultad,
    setTextoBusqueda,
    limpiarFiltros,
  } = useHistorialContext()

  const { tematicasDisponibles } = usePreguntaContext()

  const handleTematicaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setTematica(value === '' ? undefined : value)
  }

  const handleDificultadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDificultad(value === '' ? undefined : (value as Dificultad))
  }

  const handleTextoBusquedaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextoBusqueda(e.target.value)
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </h3>
        {filtroActivo && (
          <button
            onClick={limpiarFiltros}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda de texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar en pregunta
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={textoBusqueda}
              onChange={handleTextoBusquedaChange}
              placeholder="Escribe aquí..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por temática */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temática
          </label>
          <select
            value={tematica || ''}
            onChange={handleTematicaChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las temáticas</option>
            {tematicasDisponibles.map(tema => (
              <option key={tema} value={tema}>
                {tema}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por dificultad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificultad
          </label>
          <select
            value={dificultad || ''}
            onChange={handleDificultadChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las dificultades</option>
            <option value={Dificultad.FACIL}>Fácil</option>
            <option value={Dificultad.MEDIA}>Medio</option>
            <option value={Dificultad.DIFICIL}>Difícil</option>
          </select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {filtroActivo && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {filtroActivo === 1
              ? '1 filtro activo'
              : `${filtroActivo} filtros activos`}
          </p>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
