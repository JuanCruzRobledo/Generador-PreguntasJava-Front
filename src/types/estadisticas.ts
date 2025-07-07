import type { Dificultad } from './api';
import { Usuario } from './usuario';

// Tipos para sesiones de respuesta
export interface SesionRespuesta {
  id: string;
  usuarioId: string;
  fechaInicio: string;
  fechaFin?: string;
  totalPreguntas: number;
  respuestasCorrectas: number;
  puntuacionTotal: number;
  tiempoTotal?: number; // en segundos
  tematicas: string[];
  dificultades: DificultadPregunta[];
  estado: EstadoSesion;
  respuestas: RespuestaUsuario[];
}

export const EstadoSesion = {
  ACTIVA: 'ACTIVA',
  COMPLETADA: 'COMPLETADA',
  ABANDONADA: 'ABANDONADA',
} as const;
export type EstadoSesion = typeof EstadoSesion[keyof typeof EstadoSesion];

export const DificultadPregunta = {
  FACIL: 'FACIL',
  MEDIO: 'MEDIO',
  DIFICIL: 'DIFICIL',
} as const;
export type DificultadPregunta = typeof DificultadPregunta[keyof typeof DificultadPregunta];

export interface RespuestaUsuario {
  id: string;
  sesionId: string;
  preguntaId: string;
  respuestaSeleccionada: string;
  esCorrecta: boolean;
  tiempoRespuesta: number; // en segundos
  puntuacion: number;
  fechaRespuesta: string;
}

// Tipos para estadísticas
export interface EstadisticasUsuario {
  totalPreguntas: number;
  respuestasCorrectas: number;
  porcentajeAciertos: number;
  tiempoPromedio: number; // Si lo conviertes de Duration a segundos, por ejemplo
  porDificultad: Record<Dificultad, {
    total: number;
    correctas: number;
  }>;
  porTematica: Record<string, {
    total: number;
    correctas: number;
  }>;
  ultimaActualizacion: string; // o Date si lo parseas
}

export interface EstadisticaTematica {
  tematica: string;
  totalPreguntas: number;
  respuestasCorrectas: number;
  puntuacionPromedio: number;
  tiempoPromedioRespuesta: number;
}

export interface EstadisticaDificultad {
  dificultad: DificultadPregunta;
  totalPreguntas: number;
  respuestasCorrectas: number;
  puntuacionPromedio: number;
  tiempoPromedioRespuesta: number;
}

export interface ProgresoMensual {
  mes: string; // formato YYYY-MM
  sesionesCompletadas: number;
  puntuacionPromedio: number;
  respuestasCorrectas: number;
  totalPreguntas: number;
}

// DTOs para requests
export interface IniciarSesionRequest {
  usuarioId: string;
  tematicas?: string[];
  dificultades?: DificultadPregunta[];
  numeroPreguntas?: number;
}

export interface RegistrarRespuestaRequest {
  sesionId: string;
  preguntaId: string;
  respuestaSeleccionada: string;
  tiempoRespuesta: number;
}

export interface FinalizarSesionRequest {
  sesionId: string;
  estado: EstadoSesion;
}

// Filtros para consultas
export interface FiltroEstadisticas {
  fechaInicio?: string;
  fechaFin?: string;
  tematicas?: string[];
  dificultades?: DificultadPregunta[];
  soloCompletadas?: boolean;
}

export interface FiltroSesiones {
  estado?: EstadoSesion;
  fechaInicio?: string;
  fechaFin?: string;
  tematicas?: string[];
  dificultades?: DificultadPregunta[];
  limite?: number;
  offset?: number;
}

// Respuestas de API
export interface RespuestaEstadisticas {
  success: boolean;
  data: EstadisticasUsuario;
  message?: string;
}

export interface RespuestaSesiones {
  success: boolean;
  data: {
    sesiones: SesionRespuesta[];
    total: number;
    pagina: number;
    totalPaginas: number;
  };
  message?: string;
}

export interface RespuestaSesion {
  success: boolean;
  data: SesionRespuesta;
  message?: string;
}
