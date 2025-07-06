import React from 'react'
import type { Pregunta, PreguntaRespondida } from '../types/api'

interface PreguntaCardProps {
  pregunta: Pregunta | PreguntaRespondida
  respuestaSeleccionada?: string | null
  onRespuestaSeleccionada?: (respuesta: string) => void
  mostrarRespuestaCorrecta?: boolean
  isDisabled?: boolean
}

const PreguntaCard: React.FC<PreguntaCardProps> = ({
  pregunta,
  respuestaSeleccionada,
  onRespuestaSeleccionada,
  mostrarRespuestaCorrecta = false,
  isDisabled = false,
}) => {
  // Helper para obtener opciones dependiendo del tipo de pregunta
  const getOpciones = (): string[] => {
    if ('opciones' in pregunta && Array.isArray(pregunta.opciones)) {
      // Es tipo PreguntaRespondida
      if (typeof pregunta.opciones[0] === 'string') {
        return pregunta.opciones as string[];
      }
      // Es tipo Pregunta con opciones como objetos
      return (pregunta.opciones as any[]).map((o: any) => o.contenido);
    }
    return [];
  };

  // Helper para obtener respuesta correcta
  const getRespuestaCorrecta = (): string => {
    return pregunta.respuestaCorrecta;
  };

  const opciones = getOpciones();
  const respuestaCorrecta = getRespuestaCorrecta();

  const getOpcionClass = (opcion: string) => {
    let baseClass =
      'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 '

    if (isDisabled) {
      baseClass += 'cursor-not-allowed opacity-60 '
    }

    if (mostrarRespuestaCorrecta) {
      if (opcion === respuestaCorrecta) {
        baseClass += 'border-green-500 bg-green-50 text-green-800 '
      } else if (
        opcion === respuestaSeleccionada &&
        opcion !== respuestaCorrecta
      ) {
        baseClass += 'border-red-500 bg-red-50 text-red-800 '
      } else {
        baseClass += 'border-gray-300 bg-gray-50 text-gray-600 '
      }
    } else {
      if (opcion === respuestaSeleccionada) {
        baseClass += 'border-blue-500 bg-blue-50 text-blue-800 '
      } else {
        baseClass +=
          'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 '
      }
    }

    return baseClass
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {pregunta.enunciado}
      </h3>

      {/* Código Java si está disponible */}
      {'codigoJava' in pregunta && pregunta.codigoJava && (
        <div className="mb-4 p-4 bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-green-400 text-sm">
            <code>{pregunta.codigoJava}</code>
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

      {mostrarRespuestaCorrecta && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Explicación:</span>{' '}
            {pregunta.explicacion}
          </p>
        </div>
      )}
    </div>
  )
}

export default PreguntaCard
