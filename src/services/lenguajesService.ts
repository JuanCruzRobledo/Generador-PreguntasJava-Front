import axios from 'axios'
import type { ApiResponse, Lenguaje } from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api/v1'

/**
 * Servicio para manejar operaciones con lenguajes de programación
 * 
 * Endpoints disponibles:
 * - GET /api/v1/lenguajes -> Obtiene todos los lenguajes
 */
export const lenguajesService = {
  /**
   * Obtiene todos los lenguajes de programación disponibles
   * 
   * @returns Promise<Lenguaje[]> Lista de lenguajes
   */
  async obtenerLenguajes(): Promise<Lenguaje[]> {
    try {
      const response = await axios.get<ApiResponse<Lenguaje[]>>(`${API_BASE_URL}/lenguajes`)
      
      if (response.data.exitoso) {
        return response.data.datos
      }
      
      throw new Error(response.data.mensaje || 'Error al obtener lenguajes')
    } catch (error) {
      console.error('Error en lenguajesService.obtenerLenguajes:', error)
      throw error
    }
  }
}
