import axios from 'axios'
import type { ApiResponse, CategoriaTematica } from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api/v1'

/**
 * Servicio para manejar operaciones con categorías temáticas
 * 
 * Endpoints disponibles:
 * - GET /api/v1/lenguaje/:id/categorias -> Obtiene categorías de un lenguaje
 */
export const categoriasService = {
  /**
   * Obtiene las categorías temáticas de un lenguaje específico
   * 
   * @param lenguajeId - ID del lenguaje
   * @returns Promise<CategoriaTematica[]> Lista de categorías
   */
  async obtenerCategoriasPorLenguaje(lenguajeId: number): Promise<CategoriaTematica[]> {
    try {
      const response = await axios.get<ApiResponse<CategoriaTematica[]>>(
        `${API_BASE_URL}/lenguaje/${lenguajeId}/categorias`
      )
      
      if (response.data.exitoso) {
        return response.data.datos
      }
      
      throw new Error(response.data.mensaje || 'Error al obtener categorías')
    } catch (error) {
      console.error('Error en categoriasService.obtenerCategoriasPorLenguaje:', error)
      throw error
    }
  }
}
