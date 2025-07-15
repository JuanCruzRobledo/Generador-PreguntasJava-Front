import httpClient, { handleApiResponse, handleApiError } from './httpClient';
import type { ApiResponse, CategoriaTematica } from '../types/api';

// 🚀 Servicio para manejar categorías temáticas usando httpClient centralizado
export const categoriasService = {
  /**
   * 🌐 Obtiene las categorías temáticas de un lenguaje específico
   * @param lenguajeId - ID del lenguaje
   * @returns Promise<CategoriaTematica[]> Lista de categorías
   */
  async obtenerCategoriasPorLenguaje(
    lenguajeId: number
  ): Promise<CategoriaTematica[]> {
    try {
      const response = await httpClient.get<ApiResponse<CategoriaTematica[]>>(
        `/lenguaje/${lenguajeId}/categorias`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default categoriasService;