import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight, Play, RotateCcw, X } from 'lucide-react'
import { usePreguntaContext } from '../contexts/PreguntaContext'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import PreguntaCard from './PreguntaCard'
import { Dificultad, type GenerarPreguntaRequest } from '../types/api'

interface FormData {
  dificultad: string
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
    tematicasDisponibles,
  } = usePreguntaContext()

  const [tematicasDeseadas, setTematicasDeseadas] = useState<string[]>([])
  const [tematicasYaUtilizadas, setTematicasYaUtilizadas] = useState<string[]>(
    []
  )
  const [inputTematica, setInputTematica] = useState<string>('')

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: {
      dificultad: '',
    },
  })

  // Filtra las temáticas disponibles para mostrar como sugerencias,
  // excluyendo las que ya están seleccionadas y filtrando por input
  const sugerenciasFiltradas = useMemo(() => {
    if (!inputTematica.trim()) return []
    const filtro = inputTematica.trim().toLowerCase()
    return tematicasDisponibles
      .filter(t => !tematicasDeseadas.includes(t))
      .filter(t => t.toLowerCase().includes(filtro))
  }, [inputTematica, tematicasDisponibles, tematicasDeseadas])

  // Agrega temática al presionar espacio o al seleccionar sugerencia
  const agregarTematica = (tematica: string) => {
    const t = tematica.toLowerCase()
    if (!tematicasDeseadas.includes(t)) {
      setTematicasDeseadas([...tematicasDeseadas, t])
    }
    setInputTematica('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && inputTematica.trim()) {
      e.preventDefault()
      agregarTematica(inputTematica.trim())
    }
  }

  const eliminarTematica = (tematica: string) => {
    setTematicasDeseadas(prev => prev.filter(t => t !== tematica))
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (tematicasDeseadas.length === 0 && tematicasYaUtilizadas.length > 0) {
        setTematicasDeseadas(tematicasYaUtilizadas)
        setTematicasYaUtilizadas([])
        return
      }

      const request: GenerarPreguntaRequest = {
        dificultad: (data.dificultad as Dificultad) || undefined,
        tematicasDeseadas,
        tematicasYaUtilizadas,
      }

      await generarPregunta(request)
      setMostrarRespuestaCorrecta(false)
    } catch (error) {
      console.error('Error al generar pregunta:', error)
    }
  }

  const [mostrarRespuestaCorrecta, setMostrarRespuestaCorrecta] =
    useState(false)

  const handleNuevaPregunta = () => {
    reiniciar()
    reset()
    setMostrarRespuestaCorrecta(false)
  }

  const handleRespuestaSeleccionada = async (respuesta: string) => {
    if (!pregunta?.id || respuestaSeleccionada) return

    try {
      seleccionarRespuesta(respuesta)
      await validarRespuesta(pregunta.id, respuesta)
      setMostrarRespuestaCorrecta(true)

      const tematicaPrincipal = pregunta.tematicas?.[0]?.nombre

      if (
        tematicaPrincipal &&
        !tematicasYaUtilizadas.includes(tematicaPrincipal)
      ) {
        setTematicasYaUtilizadas([...tematicasYaUtilizadas, tematicaPrincipal])
        setTematicasDeseadas(
          tematicasDeseadas.filter(t => t !== tematicaPrincipal)
        )
      }
    } catch (error) {
      console.error('Error al validar respuesta:', error)
    }
  }

  const handleSiguientePregunta = async () => {
    if (tematicasDeseadas.length === 0 && tematicasYaUtilizadas.length > 0) {
      setTematicasDeseadas(tematicasYaUtilizadas)
      setTematicasYaUtilizadas([])
      return
    }

    reiniciar()
    setMostrarRespuestaCorrecta(false)

    const dificultad = watch('dificultad')

    const request: GenerarPreguntaRequest = {
      dificultad: (dificultad as Dificultad) || undefined,
      tematicasDeseadas,
      tematicasYaUtilizadas,
    }

    try {
      await generarPregunta(request)
    } catch (error) {
      console.error('Error al generar siguiente pregunta:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generador de Preguntas Java
        </h1>
        <p className="text-gray-600">
          Genera preguntas de análisis de código Java secuencial y pon a prueba
          tus conocimientos
        </p>
      </div>

      {error && <ErrorAlert error={error} onClose={limpiarError} />}

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

              {/* Input de temática con espacio para tags y sugerencias */}
              <div className="relative">
                <label
                  htmlFor="tematicas"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Temáticas deseadas (usa espacio para agregar)
                </label>
                <input
                  type="text"
                  value={inputTematica}
                  onChange={e => setInputTematica(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: bucles arrays condicionales"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />

                {/* Lista de sugerencias */}
                {sugerenciasFiltradas.length > 0 && (
                  <ul className="absolute z-10 max-h-48 w-full overflow-auto rounded border bg-white shadow-md mt-1">
                    {sugerenciasFiltradas.map((sugerencia, i) => (
                      <li
                        key={i}
                        className="cursor-pointer px-3 py-1 hover:bg-blue-100"
                        onClick={() => agregarTematica(sugerencia)}
                      >
                        {sugerencia}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Lista de etiquetas */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {tematicasDeseadas.map((tematica, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tematica}
                      <button
                        type="button"
                        onClick={() => eliminarTematica(tematica)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

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

      {isLoading && !pregunta && (
        <LoadingSpinner size="lg" text="Generando pregunta..." />
      )}

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

          <div className="text-center space-x-4">
            <Button onClick={handleNuevaPregunta} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Nueva Generación
            </Button>
            <Button
              onClick={handleSiguientePregunta}
              variant="outline"
              size="lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Siguiente Pregunta
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PreguntaGenerator
