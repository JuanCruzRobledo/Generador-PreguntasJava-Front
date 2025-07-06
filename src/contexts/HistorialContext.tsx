import React, { createContext, useContext, type ReactNode } from 'react'
import { useHistorial } from '../hooks/useHistorial'
import type {
  Dificultad,
  PreguntaRespondida,
  TematicaConEstadisticas,
  EstadisticasUsuario,
} from '../types/api'

interface HistorialContextType {
  // Estado principal
  preguntas: PreguntaRespondida[]
  todasLasPreguntas: PreguntaRespondida[]
  tematicas: TematicaConEstadisticas[]
  filtroTematica: string | null
  isLoading: boolean
  error: string | null

  // Propiedades de filtros
  tematica: string | null
  dificultad: Dificultad | null
  textoBusqueda: string
  tematicasDisponibles: string[]

  // Acciones para filtros
  setTematica: (tematica: string | undefined) => void
  setDificultad: (dificultad: Dificultad | undefined) => void
  setTextoBusqueda: (texto: string) => void
  limpiarFiltros: () => void

  // Funciones principales
  cargarPreguntas: () => Promise<any>
  cargarPreguntasPorTematica: (nombreTematica: string) => Promise<any>
  cargarTematicas: () => Promise<any>
  aplicarFiltroTematica: (tematica: string | null) => void
  refrescar: () => Promise<void>
  limpiarError: () => void

  // Estados computados
  totalPreguntas: number
  totalTematicas: number
  hayFiltroActivo: boolean
  filtroActivo: number
  estaVacio: boolean

  // Estadísticas del usuario
  estadisticas: EstadisticasUsuario
}

const HistorialContext = createContext<HistorialContextType | undefined>(
  undefined
)

interface HistorialProviderProps {
  children: ReactNode
}

export const HistorialProvider: React.FC<HistorialProviderProps> = ({
  children,
}) => {
  const historialState = useHistorial()

  return (
    <HistorialContext.Provider value={historialState}>
      {children}
    </HistorialContext.Provider>
  )
}

export const useHistorialContext = () => {
  const context = useContext(HistorialContext)
  if (context === undefined) {
    throw new Error(
      'useHistorialContext debe ser usado dentro de un HistorialProvider'
    )
  }
  return context
}
