// Tipos base para las respuestas de la API
export interface ApiResponse<T = any> {
  exitoso: boolean;
  mensaje: string;
  datos: T;
  timestamp: string;
  error?: string;
}

// Enums - Dificultad con valores para frontend y backend
export const Dificultad = {
  FACIL: 'FACIL',
  MEDIA: 'MEDIA',
  DIFICIL: 'DIFICIL'
} as const;

export type Dificultad = typeof Dificultad[keyof typeof Dificultad];

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
  dificultad: Dificultad;
  respuestaCorrecta: string;
  explicacion: string;
  opciones: Opcion[];
  tematicas: Tematica[];
}

// Tipos para las requests
export interface GenerarPreguntaRequest {
  dificultad?: Dificultad;
  tematicasDeseadas?: string[];
  tematicasYaUtilizadas?: string[];
}

export interface ValidarRespuestaRequest {
  preguntaId: number;
  opcionSeleccionada: string;
}

// Resultado de validación
export interface ValidacionResponse {
  esCorrecta: boolean;
  explicacion: string;
  respuestaCorrecta: string;
}

// Estado del generador de preguntas
export interface PreguntaState {
  pregunta: Pregunta | null;
  respuestaSeleccionada: string | null;
  resultado: ValidacionResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Pregunta respondida (para historial)
export interface PreguntaRespondida {
  id: number;
  enunciado: string;
  codigoJava?: string;
  respuestaCorrecta: string;
  respuestaUsuario?: string;   
  fechaRespuesta?: string;      
  tematica: string;
  dificultad: Dificultad;
  esCorrecta?: boolean;         
  opciones: string[];
  explicacion: string;
}

// Estadísticas por temática
export interface TematicaEstadisticas {
  nombre: string;
  total: number;
  correctas: number;
  porcentajeAcierto: number;
}

// Estado del historial
export interface HistorialState {
  preguntas: PreguntaRespondida[];
  //tematicas: TematicaEstadisticas[];
  filtroTematica: string | null;
  isLoading: boolean;
  error: string | null;
}

// Helper types
export type ApiResponsePregunta = ApiResponse<Pregunta>;
export type ApiResponseValidacion = ApiResponse<ValidacionResponse>;
export type ApiResponseHistorial = ApiResponse<PreguntaRespondida[]>;