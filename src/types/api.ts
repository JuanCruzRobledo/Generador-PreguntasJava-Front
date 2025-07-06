// Tipos base para las respuestas de la API
export interface ApiResponse<T> {
  exitoso: boolean;
  mensaje: string;
  datos: T;
  timestamp: string;
  error?: string;
}

// Tipos para las entidades del dominio
export interface Opcion {
  id: number;
  contenido: string;
}

export interface Tematica {
  id: number;
  nombre: string;
  contadorUsos: number;
  timestampUltimoUso: string;
}

export interface Pregunta {
  id: number;
  codigoJava: string;
  enunciado: string;
  dificultad: DificultadValue;
  respuestaCorrecta: string;
  explicacion: string;
  opciones: Opcion[];
  tematicas: Tematica[];
}

// Enums - coinciden con el backend Java
export const Dificultad = {
  FACIL: 'FACIL',
  MEDIA: 'MEDIA',
  DIFICIL: 'DIFICIL'
} as const;

export type DificultadValue = typeof Dificultad[keyof typeof Dificultad];

// Tipos para las requests
export interface GenerarPreguntaRequest {
  dificultad?: string;
  tematicaDeseada?: string;
}

export interface ValidarRespuestaRequest {
  preguntaId: number;
  opcionSeleccionada: string;
}

// Tipos para las responses específicas
export interface ValidacionResponse {
  esCorrecta: boolean;
  explicacion: string;
  respuestaCorrecta: string;
}

// Tipos para el estado local del generador de preguntas
export interface PreguntaState {
  pregunta: Pregunta | null;
  respuestaSeleccionada: string | null;
  resultado: ValidacionResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Tipos para el historial
export interface HistorialState {
  preguntas: PreguntaRespondida[];
  tematicas: TematicaConEstadisticas[];
  filtroTematica: string | null;
  isLoading: boolean;
  error: string | null;
}

// Pregunta respondida por el usuario (para el historial)
export interface PreguntaRespondida {
  id: number;
  enunciado: string;
  codigoJava: string;
  respuestaCorrecta: string;
  respuestaUsuario?: string;
  fechaRespuesta?: string;
  tematica: string; // Solo la temática principal
  dificultad: DificultadValue;
  esCorrecta?: boolean;
  opciones: string[]; // Array de strings en lugar de objetos Opcion
  explicacion: string;
}

// Temática con estadísticas calculadas
export interface TematicaConEstadisticas {
  nombre: string;
  total: number;
  correctas: number;
  incorrectas: number;
  porcentajeAcierto: number;
}

// Estadísticas del usuario
export interface EstadisticasUsuario {
  totalPreguntas: number;
  respuestasCorrectas: number;
  porcentajeAciertos: number;
  tiempoPromedio: number;
  porDificultad: Record<string, {
    total: number;
    correctas: number;
  }>;
  porTematica: Record<string, {
    total: number;
    correctas: number;
  }>;
}
