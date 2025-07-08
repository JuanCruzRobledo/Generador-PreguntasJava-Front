import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { GenerarPreguntaRequest, Pregunta, ValidacionResponse, ValidarRespuestaRequest } from '../types/api';

interface PreguntaState {
  pregunta: Pregunta | null;
  respuestaSeleccionada: string | null;
  resultado: ValidacionResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const usePregunta = () => {
  const [state, setState] = useState<PreguntaState>({
    pregunta: null,
    respuestaSeleccionada: null,
    resultado: null,
    isLoading: false,
    error: null,
  });

  // NUEVO: Estado para almacenar las temáticas cargadas desde backend
  const [tematicasDisponibles, setTematicasDisponibles] = useState<string[]>([])

  // NUEVO: Función para cargar todas las temáticas de la API
  const cargarTematicas = useCallback(async () => {
    try {
      const tematicas = await apiService.obtenerTodasLasTematicas()
      // Asumiendo que tematicas es un array de objetos con { nombre: string, ... }
      const nombresTematicas = tematicas.map(t => t.nombre)
      setTematicasDisponibles(nombresTematicas)
    } catch (error) {
      // Opcional: manejar error en la carga de temáticas
      console.error('Error al cargar temáticas:', error)
    }
  }, [])

  useEffect(() => {
    cargarTematicas()
  }, [cargarTematicas])

  // Generar nueva pregunta
  const generarPregunta = useCallback(async (request: GenerarPreguntaRequest = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const pregunta = await apiService.generarPregunta(request);
      setState(prev => ({
        ...prev,
        pregunta,
        respuestaSeleccionada: null,
        resultado: null,
        isLoading: false,
      }));
      return pregunta;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar pregunta';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Seleccionar una respuesta
  const seleccionarRespuesta = useCallback((respuesta: string) => {
    setState(prev => ({
      ...prev,
      respuestaSeleccionada: respuesta,
      resultado: null,
    }));
  }, []);

  // Validar respuesta seleccionada
  const validarRespuesta = useCallback(
    async (preguntaId: number, opcionSeleccionada: string) => {
      if (!preguntaId || !opcionSeleccionada) {
        throw new Error('No hay pregunta o respuesta seleccionada');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const resultado = await apiService.validarRespuesta(
          {
            preguntaId, 
            opcionSeleccionada
          } as ValidarRespuestaRequest
        );

        setState(prev => ({
          ...prev,
          resultado,
          isLoading: false,
        }));

        return resultado;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al validar respuesta';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  // Reiniciar estado
  const reiniciar = useCallback(() => {
    setState({
      pregunta: null,
      respuestaSeleccionada: null,
      resultado: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    pregunta: state.pregunta,
    respuestaSeleccionada: state.respuestaSeleccionada,
    resultado: state.resultado,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones
    generarPregunta,
    seleccionarRespuesta,
    validarRespuesta, 
    reiniciar,
    limpiarError,

    tematicasDisponibles,
    
    // Estados computados
    puedeValidar: state.pregunta !== null && state.respuestaSeleccionada !== null,
    tieneResultado: state.resultado !== null,
    esRespuestaCorrecta: state.resultado?.esCorrecta || false,
  };
};
