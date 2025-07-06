import React, { createContext, useContext, type ReactNode } from 'react'
import { usePregunta } from '../hooks/usePregunta'
import type { GenerarPreguntaRequest, Pregunta } from '../types/api'

interface PreguntaContextType {
  pregunta: Pregunta | null
  isLoading: boolean
  error: string | null
  generarPregunta: (request?: GenerarPreguntaRequest) => Promise<Pregunta>
  responder: (respuesta: string) => Promise<void>
  reiniciar: () => void
  limpiarError: () => void
}

const PreguntaContext = createContext<PreguntaContextType | undefined>(
  undefined
)

interface PreguntaProviderProps {
  children: ReactNode
}

export const PreguntaProvider: React.FC<PreguntaProviderProps> = ({
  children,
}) => {
  const preguntaState = usePregunta()

  return (
    <PreguntaContext.Provider value={preguntaState}>
      {children}
    </PreguntaContext.Provider>
  )
}

export const usePreguntaContext = () => {
  const context = useContext(PreguntaContext)
  if (context === undefined) {
    throw new Error(
      'usePreguntaContext debe ser usado dentro de un PreguntaProvider'
    )
  }
  return context
}
