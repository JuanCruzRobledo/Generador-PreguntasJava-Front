import React, { useEffect, useMemo } from 'react'
import type {
  Pregunta,
  PreguntaRespondida,
  Opcion,
  ValidacionResponse,
} from '../types/api'

interface PreguntaCardProps {
  pregunta: Pregunta | PreguntaRespondida
  respuestaSeleccionada?: string | null
  onRespuestaSeleccionada?: (respuesta: string) => void
  mostrarRespuestaCorrecta?: boolean
  isDisabled?: boolean
  resultado?: ValidacionResponse | null
  className?: string
}

const PreguntaCard: React.FC<PreguntaCardProps> = ({
  pregunta,
  respuestaSeleccionada,
  onRespuestaSeleccionada,
  mostrarRespuestaCorrecta = false,
  isDisabled = false,
  resultado = null,
  className = '',
}) => {
  // Helper para determinar si es PreguntaRespondida o Pregunta
  const isPreguntaRespondida = (
    p: Pregunta | PreguntaRespondida
  ): p is PreguntaRespondida => {
    return 'respuestaUsuario' in p && 'esCorrecta' in p
  }

  // Usar useMemo para optimizar el cálculo de opciones
  const opciones = useMemo((): string[] => {
    if (!pregunta || !pregunta.opciones) {
      console.warn('Pregunta sin opciones:', pregunta)
      return []
    }

    if (isPreguntaRespondida(pregunta)) {
      // Es PreguntaRespondida - opciones son strings
      return pregunta.opciones as string[]
    } else {
      // Es Pregunta - opciones son objetos Opcion
      return (pregunta.opciones as Opcion[]).map(
        (opcion: Opcion) => opcion.contenido
      )
    }
  }, [pregunta])

  // Obtener respuesta correcta
  const respuestaCorrecta = pregunta?.respuestaCorrecta || null

  const getOpcionClass = (opcion: string) => {
    let baseClass =
      'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 '

    if (isDisabled) {
      baseClass += 'cursor-not-allowed opacity-60 '
    }

    if (mostrarRespuestaCorrecta) {
      if (resultado?.esCorrecta) {
        // La respuesta fue correcta: pintar la opción seleccionada y la correcta en verde
        if (opcion === respuestaSeleccionada) {
          baseClass += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 '
        } else if (opcion === respuestaCorrecta) {
          baseClass += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 '
        } else {
          baseClass += 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 '
        }
      } else {
        // La respuesta fue incorrecta: la correcta verde y la seleccionada incorrecta roja
        if (opcion === respuestaCorrecta) {
          baseClass += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 '
        } else if (opcion === respuestaSeleccionada) {
          baseClass += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 '
        } else {
          baseClass += 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 '
        }
      }
    } else {
      if (opcion === respuestaSeleccionada) {
        baseClass += 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 '
      } else {
        baseClass +=
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 '
      }
    }

    return baseClass
  }

  useEffect(() => {
    // Solo hacer log cuando la pregunta cambia
    if (pregunta) {
      console.log('Pregunta cargada:', pregunta)
      console.log('Opciones procesadas:', opciones)
    }
  }, [pregunta?.id, opciones.length]) // Solo ejecutar cuando cambia la pregunta

  // Validar que la pregunta tenga al menos el mínimo necesario
  if (!pregunta || !pregunta.enunciado) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p className="text-red-800">Error: Pregunta inválida o sin enunciado</p>
      </div>
    )
  }

  // Validar que tenga opciones
  if (opciones.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {pregunta.enunciado}
        </h3>
        <p className="text-yellow-800">
          Error: Esta pregunta no tiene opciones válidas
        </p>
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300 ${className}`.trim()}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {pregunta.enunciado}
      </h3>

      {/* Código fuente si está disponible */}
      {(pregunta.codigoFuente || ('codigoJava' in pregunta && pregunta.codigoJava)) && (
        <div className="mb-4 p-4 bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{pregunta.codigoFuente || ('codigoJava' in pregunta && pregunta.codigoJava)}</code>
          </pre>
        </div>
      )}

      <div className="space-y-3">
        {opciones.map((opcion, index) => (
          <div
            key={index}
            className={getOpcionClass(opcion)}
            onClick={() => !isDisabled && onRespuestaSeleccionada?.(opcion)}
          >
            <span className="font-medium mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {opcion}
          </div>
        ))}
      </div>

      {/* Resultado de la validación */}
      {resultado && (
        <div
          className={`mt-4 p-4 rounded-lg border transition-colors duration-300 ${
            resultado.esCorrecta
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-sm font-semibold ${
                resultado.esCorrecta ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}
            >
              {resultado.esCorrecta
                ? '✅ ¡Respuesta Correcta!'
                : '❌ Respuesta Incorrecta'}
            </span>
          </div>

          {!resultado.esCorrecta && (
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              <span className="font-medium">Respuesta correcta:</span>{' '}
              {resultado.respuestaCorrecta}
            </p>
          )}

          <p
            className={`text-sm ${
              resultado.esCorrecta ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}
          >
            <span className="font-medium">Explicación:</span>{' '}
            {resultado.explicacion}
          </p>
        </div>
      )}

      {/* Fallback para mostrar explicación general si no hay resultado específico */}
      {mostrarRespuestaCorrecta && !resultado && pregunta.explicacion && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-300">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Explicación:</span>{' '}
            {pregunta.explicacion}
          </p>
        </div>
      )}
    </div>
  )
}

export default PreguntaCard
