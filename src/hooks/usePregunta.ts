import { useState, useCallback } from 'react';
import type {  
  GenerarPreguntaRequest,
  PreguntaState 
} from '../types/api';
import { apiService } from '../services/apiService';

export const usePregunta = () => {
  const [state, setState] = useState<PreguntaState>({
    pregunta: null,
    respuestaSeleccionada: null,
    resultado: null,
    isLoading: false,
    error: null,
  });

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
        error: null,
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
  const validarRespuesta = useCallback(async () => {
    if (!state.pregunta || !state.respuestaSeleccionada) {
      throw new Error('No hay pregunta o respuesta seleccionada');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const resultado = await apiService.validarRespuesta({
        preguntaId: state.pregunta.id,
        opcionSeleccionada: state.respuestaSeleccionada,
      });

      setState(prev => ({
        ...prev,
        resultado,
        isLoading: false,
        error: null,
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
  }, [state.pregunta, state.respuestaSeleccionada]);

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

  const responder = useCallback(async (respuesta: string) => {
  seleccionarRespuesta(respuesta);
  await validarRespuesta();
}, [seleccionarRespuesta, validarRespuesta]);


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
    responder, 
    reiniciar,
    limpiarError,
    
    // Estados computados
    puedeValidar: state.pregunta !== null && state.respuestaSeleccionada !== null,
    tieneResultado: state.resultado !== null,
    esRespuestaCorrecta: state.resultado?.esCorrecta || false,
  };
};
