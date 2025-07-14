import { useState, useCallback } from 'react';
import { preguntasService } from '../services/preguntasService';
import type { GenerarPreguntaRequest, Pregunta, ValidacionResponse } from '../types/api';

interface PreguntaState {
  pregunta: Pregunta | null;
  respuestaSeleccionada: string | null;
  resultado: ValidacionResponse | null;
  isLoading: boolean;
  isGenerandoPregunta: boolean,
  isValidandoRespuesta: boolean,
  error: string | null;
}

export const usePregunta = () => {
  const [state, setState] = useState<PreguntaState>({
    pregunta: null,
    respuestaSeleccionada: null,
    resultado: null,
    isLoading: false,
    isGenerandoPregunta: false,
    isValidandoRespuesta: false,
    error: null,
  });

  // Generar nueva pregunta
  const generarPregunta = useCallback(async (request: GenerarPreguntaRequest) => {
    setState(prev => ({ ...prev, isGenerandoPregunta: true, isLoading: true, error: null }));
    
    try {
      const pregunta = await preguntasService.generarPregunta(request);
      setState(prev => ({
        ...prev,
        pregunta,
        respuestaSeleccionada: null,
        resultado: null,
        isGenerandoPregunta: false,
        isLoading: false,
      }));
      return pregunta;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar pregunta';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isGenerandoPregunta: false,
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
        setState(prev => ({ ...prev, isValidandoRespuesta: false, isLoading: false }));
        throw new Error('No hay pregunta o respuesta seleccionada');
      }

      setState(prev => ({ ...prev, isValidandoRespuesta: true, isLoading: true, error: null }));

      try {
        const resultado = await preguntasService.validarRespuesta({ preguntaId, opcionSeleccionada });

        setState(prev => ({
          ...prev,
          resultado,
          isValidandoRespuesta: false,
          isLoading: false,
        }));

        return resultado;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al validar respuesta';
        setState(prev => ({
          ...prev,
          isValidandoRespuesta: false,
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
      isGenerandoPregunta: false,
      isValidandoRespuesta: false,
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
    isGenerandoPregunta: state.isGenerandoPregunta,
    isValidandoRespuesta: state.isValidandoRespuesta,
    error: state.error,
    
    // Acciones
    generarPregunta,
    seleccionarRespuesta,
    validarRespuesta, 
    reiniciar,
    limpiarError,
    
    // Estados computados
    puedeValidar: state.pregunta !== null && state.respuestaSeleccionada !== null,
    tieneResultado: state.resultado !== null,
    esRespuestaCorrecta: state.resultado?.esCorrecta || false,
  };
};
