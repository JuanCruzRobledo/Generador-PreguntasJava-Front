import type { Pregunta, PreguntaRespondida } from '../types/api';

// TODO: revisar implementación - propiedades comentadas para evitar errores
export function mapPreguntaToRespondida(p: Pregunta): PreguntaRespondida {
  return {
    id: p.id,
    enunciado: p.enunciado,
    codigoFuente: p.codigoFuente, // Sí existe en ambos tipos
    // respuestaCorrecta: p.respuestaCorrecta, // No existe en tipo Pregunta
    respuestaCorrecta: 'Respuesta no disponible',
    respuestaUsuario: undefined, // Se puede rellenar después
    fechaRespuesta: undefined,   // Se puede rellenar después
    // tematica: p.tematicas[0]?.nombre || 'Sin temática', // No existe en tipo Pregunta
    tematica: 'Sin temática',
    dificultad: p.dificultad,
    esCorrecta: undefined, // Se puede rellenar después
    opciones: p.opciones.map(o => o.contenido),
    explicacion: p.explicacion
  };
}
