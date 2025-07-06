import type { Pregunta, PreguntaRespondida } from '../types/api';

export function mapPreguntaToRespondida(p: Pregunta): PreguntaRespondida {
  return {
    id: p.id,
    enunciado: p.enunciado,
    codigoJava: p.codigoJava,
    respuestaCorrecta: p.respuestaCorrecta,
    respuestaUsuario: undefined, // Se puede rellenar después
    fechaRespuesta: undefined,   // Se puede rellenar después
    tematica: p.tematicas[0]?.nombre || 'Sin temática',
    dificultad: p.dificultad,
    esCorrecta: undefined, // Se puede rellenar después
    opciones: p.opciones.map(o => o.contenido),
    explicacion: p.explicacion
  };
}
