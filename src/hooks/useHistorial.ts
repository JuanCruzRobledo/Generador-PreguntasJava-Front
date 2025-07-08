import { useState, useCallback, useEffect } from 'react';
import type { HistorialState, Dificultad } from '../types/api';
import { apiService } from '../services/apiService';
import { mapPreguntaToRespondida } from '../utils/mapPreguntaToRespondida';
import type { EstadisticasUsuario } from '../types/estadisticas';

interface ExtendedHistorialState extends HistorialState {
  textoBusqueda: string;
  filtroDificultad: Dificultad | null;
}

export const useHistorial = () => {
  const [state, setState] = useState<ExtendedHistorialState>({
    preguntas: [],
    tematicas: [],
    filtroTematica: null,
    isLoading: false,
    error: null,
    textoBusqueda: '',
    filtroDificultad: null,
  });

  // Cargar todas las preguntas
  const cargarPreguntas = useCallback(async () => {
  setState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
    const preguntasAPI = await apiService.obtenerTodasLasPreguntas();

    const preguntasTransformadas = preguntasAPI.map(mapPreguntaToRespondida);

    setState(prev => ({
      ...prev,
      preguntas: preguntasTransformadas,
      isLoading: false,
      error: null,
    }));

    return preguntasTransformadas;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar preguntas';
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage,
    }));
    throw error;
  }
}, []);

  // Cargar todas las temáticas
  const cargarTematicas = useCallback(async () => {
    try {
      const tematicas = await apiService.obtenerTodasLasTematicas();
      
      return tematicas;
    } catch (error) {
      console.error('Error al cargar temáticas:', error);
      // No mostramos error para temáticas ya que es información auxiliar
      return [];
    }
  }, []);

  // Filtrar preguntas localmente (si ya están cargadas)
  const aplicarFiltroTematica = useCallback((nombreTematica: string | null) => {
    setState(prev => ({
      ...prev,
      filtroTematica: nombreTematica,
    }));
  }, []);

  // Establecer filtro de texto
  const setTextoBusqueda = useCallback((texto: string) => {
    setState(prev => ({
      ...prev,
      textoBusqueda: texto,
    }));
  }, []);

  // Establecer filtro de temática
  const setTematica = useCallback((tematica: string | undefined) => {
    setState(prev => ({
      ...prev,
      filtroTematica: tematica || null,
    }));
  }, []);

  // Establecer filtro de dificultad
  const setDificultad = useCallback((dificultad: Dificultad | undefined) => {
    setState(prev => ({
      ...prev,
      filtroDificultad: dificultad || null,
    }));
  }, []);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setState(prev => ({
      ...prev,
      filtroTematica: null,
      filtroDificultad: null,
      textoBusqueda: '',
    }));
  }, []);

  // Refrescar datos
  const refrescar = useCallback(async () => {
  await cargarPreguntas(); 
  await cargarTematicas();
  limpiarFiltros();
}, [cargarPreguntas, cargarTematicas]);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        await Promise.all([
          cargarPreguntas(),
          cargarTematicas(),
        ]);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    cargarDatosIniciales();
  }, [cargarPreguntas, cargarTematicas]);

  // Preguntas filtradas (computado)
  const preguntasFiltradas = state.preguntas.filter(pregunta => {
  // Filtro por temática (ahora es string, no array)
  if (state.filtroTematica) {
    if (!pregunta.tematica.toLowerCase().includes(state.filtroTematica.toLowerCase())) {
      return false;
    }
  }

  // Filtro por dificultad
  if (state.filtroDificultad) {
    if (pregunta.dificultad !== state.filtroDificultad) return false;
  }

  // Filtro por texto de búsqueda
  if (state.textoBusqueda.trim()) {
    const textoBusqueda = state.textoBusqueda.toLowerCase();
    // Buscamos en el enunciado
    if (!pregunta.enunciado.toLowerCase().includes(textoBusqueda)) {
      return false;
    }
  }

  return true;
});

  // Temáticas disponibles (computado)
  const tematicasDisponibles = Array.from(
  new Set(
    state.preguntas.map(pregunta => pregunta.tematica)
  )
).sort();

const tematicasConEstadisticas = state.tematicas.map(t => {
  const total = state.preguntas.filter(p => p.tematica === t.nombre).length;
  const correctas = state.preguntas.filter(p => p.tematica === t.nombre && p.esCorrecta).length;
  const incorrectas = total - correctas;
  const porcentajeAcierto = total > 0 ? (correctas / total) * 100 : 0;

  return {
    nombre: t.nombre,
    total,
    correctas,
    incorrectas,
    porcentajeAcierto,
  };
});

  // Calcular estadísticas del usuario
  const preguntasRespondidas = state.preguntas.filter(p => p.esCorrecta !== undefined);
  const respuestasCorrectas = preguntasRespondidas.filter(p => p.esCorrecta === true).length;
  const porcentajeAciertos = preguntasRespondidas.length > 0 ? Math.round((respuestasCorrectas / preguntasRespondidas.length) * 100) : 0;

  // Estadísticas por dificultad
  const porDificultad: Record<string, { total: number; correctas: number }> = {};
  preguntasRespondidas.forEach(p => {
    if (!porDificultad[p.dificultad]) {
      porDificultad[p.dificultad] = { total: 0, correctas: 0 };
    }
    porDificultad[p.dificultad].total++;
    if (p.esCorrecta) {
      porDificultad[p.dificultad].correctas++;
    }
  });

  // Estadísticas por temática
  const porTematica: Record<string, { total: number; correctas: number }> = {};
  preguntasRespondidas.forEach(p => {
    if (!porTematica[p.tematica]) {
      porTematica[p.tematica] = { total: 0, correctas: 0 };
    }
    porTematica[p.tematica].total++;
    if (p.esCorrecta) {
      porTematica[p.tematica].correctas++;
    }
  });

  const estadisticas: EstadisticasUsuario = {
  totalPreguntas: preguntasRespondidas.length,
  respuestasCorrectas,
  porcentajeAciertos,
  tiempoPromedio: 0, 
  porDificultad,
  porTematica,
  ultimaActualizacion: new Date().toISOString(), 
};

  return {
    // Estado
    preguntas: preguntasFiltradas,
    todasLasPreguntas: state.preguntas,
    tematicas: tematicasConEstadisticas,
    filtroTematica: state.filtroTematica,
    isLoading: state.isLoading,
    error: state.error,
    
    // Filtros
    tematica: state.filtroTematica,
    dificultad: state.filtroDificultad,
    textoBusqueda: state.textoBusqueda,
    tematicasDisponibles,
    
    // Acciones
    cargarPreguntas,
    cargarTematicas,
    aplicarFiltroTematica,
    setTematica,
    setDificultad,
    setTextoBusqueda,
    limpiarFiltros,
    refrescar,
    limpiarError,
    
    // Estados computados
    totalPreguntas: state.preguntas.length,
    totalTematicas: state.tematicas.length,
    hayFiltroActivo: state.filtroTematica !== null || state.filtroDificultad !== null || state.textoBusqueda.trim() !== '',
    filtroActivo: [
      state.filtroTematica,
      state.filtroDificultad,
      state.textoBusqueda.trim()
    ].filter(Boolean).length,
    estaVacio: state.preguntas.length === 0 && !state.isLoading,
    
    // Estadísticas
    estadisticas,
  };
};
