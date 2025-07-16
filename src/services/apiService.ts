import httpClient, { handleApiResponse, handleApiError } from './httpClient';
import type {
  ApiResponse,
  Pregunta,
  GenerarPreguntaRequest,
  ValidarRespuestaRequest,
  ValidacionResponse
} from '../types/api';

// 🚀 Servicios de la API - Usando httpClient centralizado
export const apiService = {
  
  /**
   * 📝 Generar una nueva pregunta
   * @param request Parámetros para generar la pregunta
   * @returns Promise<Pregunta> Pregunta generada
   */
  async generarPregunta(request: GenerarPreguntaRequest = {}): Promise<Pregunta> {
    try {
      const response = await httpClient.post<ApiResponse<Pregunta>>('/preguntas/generar', request);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * ✅ Validar respuesta del usuario
   * @param request Datos de la respuesta a validar
   * @returns Promise<ValidacionResponse> Resultado de la validación
   */
  async validarRespuesta(request: ValidarRespuestaRequest): Promise<ValidacionResponse> {
    try {
      const response = await httpClient.post<ApiResponse<ValidacionResponse>>('/respuesta', request);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 📚 Obtener todas las preguntas
   * @returns Promise<Pregunta[]> Lista de todas las preguntas
   */
  async obtenerTodasLasPreguntas(): Promise<Pregunta[]> {
    try {
      const response = await httpClient.get<ApiResponse<Pregunta[]>>('/preguntas');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 🏷️ Obtener preguntas por temática
   * @param nombreTematica Nombre de la temática
   * @returns Promise<Pregunta[]> Lista de preguntas de la temática
   */
  async obtenerPreguntasPorTematica(nombreTematica: string): Promise<Pregunta[]> {
    try {
      const encodedNombre = encodeURIComponent(nombreTematica);
      const response = await httpClient.get<ApiResponse<Pregunta[]>>(`/preguntas/por-tematica/${encodedNombre}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * 🏥 Verificar salud del backend
   * @returns Promise<boolean> Estado de salud del servidor
   */
  async verificarSaludBackend(): Promise<boolean> {
    try {
      const response = await httpClient.get('/health');
      if (response.status === 200) {
        return true;
      } else {
        console.warn('Backend respondió con estado no OK:', response.status);
        return false;
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        console.warn('Timeout al conectar con backend');
      } else if (error.response) {
        console.warn('Error en respuesta del backend:', error.response.status);
      } else {
        console.warn('Error al conectar con backend:', error.message || error);
      }
      return false;
    }
  }
};

export default apiService;
