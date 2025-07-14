import axios from 'axios'
import type { ApiResponse, Pregunta, GenerarPreguntaRequest, ValidarRespuestaRequest, ValidacionResponse } from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api/v1'

/**
 * Servicio para manejar operaciones con preguntas
 * 
 * Endpoints disponibles:
 * - POST /api/v1/preguntas/generar -> Genera una nueva pregunta
 * - POST /api/v1/respuesta -> Valida una respuesta
 */
export const preguntasService = {
  /**
   * Genera una nueva pregunta basada en los parámetros proporcionados
   * 
   * @param request - Parámetros para generar la pregunta
   * @returns Promise<Pregunta> Pregunta generada
   */
  async generarPregunta(request: GenerarPreguntaRequest): Promise<Pregunta> {
    try {
      const response = await axios.post<ApiResponse<Pregunta>>(
        `${API_BASE_URL}/preguntas/generar`,
        request
      )
      
      if (response.data.exitoso) {
        return response.data.datos
      }
      
      throw new Error(response.data.mensaje || 'Error al generar pregunta')
    } catch (error) {
      console.error('Error en preguntasService.generarPregunta:', error)
      throw error
    }
  },

  /**
   * Valida una respuesta proporcionada por el usuario
   * 
   * @param request - Datos de la respuesta a validar
   * @returns Promise<ValidacionResponse> Resultado de la validación
   */
  async validarRespuesta(request: ValidarRespuestaRequest): Promise<ValidacionResponse> {
    try {
      const response = await axios.post<ApiResponse<ValidacionResponse>>(
        `${API_BASE_URL}/respuesta`,
        request
      )
      
      if (response.data.exitoso) {
        return response.data.datos
      }
      
      throw new Error(response.data.mensaje || 'Error al validar respuesta')
    } catch (error) {
      console.error('Error en preguntasService.validarRespuesta:', error)
      throw error
    }
  }
}
