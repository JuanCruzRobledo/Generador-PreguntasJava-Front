import axios from 'axios'
import type { ApiResponse, TagTematica } from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api/v1'

/**
 * Servicio para manejar operaciones con tags temáticos
 * 
 * Endpoints disponibles:
 * - GET /api/v1/categoria/:id/tags -> Obtiene tags de una categoría
 */
export const tagsService = {
  /**
   * Obtiene los tags temáticos de una categoría específica
   * 
   * @param categoriaId - ID de la categoría
   * @returns Promise<TagTematica[]> Lista de tags
   */
  async obtenerTagsPorCategoria(categoriaId: number): Promise<TagTematica[]> {
    try {
      const response = await axios.get<ApiResponse<TagTematica[]>>(
        `${API_BASE_URL}/categoria/${categoriaId}/tags`
      )
      
      if (response.data.exitoso) {
        return response.data.datos
      }
      
      throw new Error(response.data.mensaje || 'Error al obtener tags')
    } catch (error) {
      console.error('Error en tagsService.obtenerTagsPorCategoria:', error)
      throw error
    }
  }
}
