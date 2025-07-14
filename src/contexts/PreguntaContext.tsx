import React, { createContext, useContext, type ReactNode } from 'react'
import { usePregunta } from '../hooks/usePregunta'
import type {
  GenerarPreguntaRequest,
  Pregunta,
  ValidacionResponse,
} from '../types/api'

interface PreguntaContextType {
  pregunta: Pregunta | null
  isLoading: boolean
  isGenerandoPregunta: boolean
  isValidandoRespuesta: boolean
  error: string | null
  respuestaSeleccionada: string | null
  resultado: {
    respuestaCorrecta: string
    explicacion: string
    esCorrecta: boolean
  } | null
  generarPregunta: (request: GenerarPreguntaRequest) => Promise<Pregunta>
  seleccionarRespuesta: (respuesta: string) => void
  validarRespuesta: (
    preguntaId: number,
    opcionSeleccionada: string
  ) => Promise<ValidacionResponse>
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
  const state = usePregunta()

  const contextValue: PreguntaContextType = {
    pregunta: state.pregunta,
    isLoading: state.isLoading,
    isGenerandoPregunta: state.isGenerandoPregunta,
    isValidandoRespuesta: state.isValidandoRespuesta,
    error: state.error,
    respuestaSeleccionada: state.respuestaSeleccionada,
    resultado: state.resultado,
    generarPregunta: state.generarPregunta,
    seleccionarRespuesta: state.seleccionarRespuesta,
    validarRespuesta: state.validarRespuesta,
    reiniciar: state.reiniciar,
    limpiarError: state.limpiarError,
  }

  return (
    <PreguntaContext.Provider value={contextValue}>
      {children}
    </PreguntaContext.Provider>
  )
}

export const usePreguntaContext = () => {
  const context = useContext(PreguntaContext)
  if (context === undefined) {
    throw new Error(
      'usePreguntaContext debe usarse dentro de un PreguntaProvider'
    )
  }
  return context
}
