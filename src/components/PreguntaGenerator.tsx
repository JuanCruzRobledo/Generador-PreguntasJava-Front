import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Play, RotateCcw } from 'lucide-react'
import { usePreguntaContext } from '../contexts/PreguntaContext'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import PreguntaCard from './PreguntaCard'
import { Dificultad, type GenerarPreguntaRequest } from '../types/api'

interface FormData {
  dificultad: string
  tematicaDeseada: string
}

export const PreguntaGenerator: React.FC = () => {
  const {
    pregunta,
    isLoading,
    error,
    generarPregunta,
    reiniciar,
    limpiarError,
    validarRespuesta,
    respuestaSeleccionada,
    seleccionarRespuesta,
    resultado,
  } = usePreguntaContext()

  const [mostrarRespuestaCorrecta, setMostrarRespuestaCorrecta] =
    useState(false)

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      dificultad: '',
      tematicaDeseada: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const request: GenerarPreguntaRequest = {}

      if (data.dificultad) request.dificultad = data.dificultad as Dificultad
      if (data.tematicaDeseada.trim())
        request.tematicaDeseada = data.tematicaDeseada.trim()

      await generarPregunta(request)
      setMostrarRespuestaCorrecta(false)
    } catch (error) {
      console.error('Error al generar pregunta:', error)
    }
  }

  const handleNuevaPregunta = () => {
    reiniciar()
    reset()
    setMostrarRespuestaCorrecta(false)
  }

  const handleRespuestaSeleccionada = async (respuesta: string) => {
    if (!pregunta?.id || respuestaSeleccionada) return

    try {
      // 1. Seleccionamos la respuesta (actualiza el estado)
      seleccionarRespuesta(respuesta)

      // 2. Validamos con el backend
      await validarRespuesta(pregunta.id, respuesta)

      // 3. Mostramos el resultado (el contexto ya actualizó resultado)
      setMostrarRespuestaCorrecta(true)
    } catch (error) {
      console.error('Error al validar respuesta:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generador de Preguntas Java
        </h1>
        <p className="text-gray-600">
          Genera preguntas de análisis de código Java secuencial y pon a prueba
          tus conocimientos
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onClose={limpiarError} />}

      {/* Formulario de generación */}
      {!pregunta && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selector de dificultad */}
              <div>
                <label
                  htmlFor="dificultad"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Dificultad (opcional)
                </label>
                <select
                  {...register('dificultad')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Cualquier dificultad</option>
                  <option value={Dificultad.FACIL}>Fácil</option>
                  <option value={Dificultad.MEDIA}>Media</option>
                  <option value={Dificultad.DIFICIL}>Difícil</option>
                </select>
              </div>

              {/* Input de temática */}
              <div>
                <label
                  htmlFor="tematica_deseada"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Temática deseada (opcional)
                </label>
                <input
                  {...register('tematicaDeseada')}
                  type="text"
                  placeholder="ej: arrays, bucles, condicionales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botón de generar */}
            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="min-w-48"
              >
                <Play className="w-5 h-5 mr-2" />
                Generar Pregunta
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading && !pregunta && (
        <LoadingSpinner size="lg" text="Generando pregunta..." />
      )}

      {/* Pregunta generada */}
      {pregunta && (
        <div className="space-y-6">
          <PreguntaCard
            pregunta={pregunta}
            respuestaSeleccionada={respuestaSeleccionada}
            onRespuestaSeleccionada={handleRespuestaSeleccionada}
            mostrarRespuestaCorrecta={mostrarRespuestaCorrecta}
            isDisabled={!!respuestaSeleccionada}
            resultado={resultado}
          />

          <div className="text-center">
            <Button onClick={handleNuevaPregunta} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Nueva Pregunta
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PreguntaGenerator
