import { useQuery } from '@tanstack/react-query'
import { categoriasService } from '../services/categoriasService'
import type { CategoriaTematica } from '../types/api'

/**
 * Hook personalizado para manejar categorías temáticas
 * 
 * Proporciona:
 * - Lista de categorías por lenguaje
 * - Estado de carga
 * - Manejo de errores
 * - Caché automático
 */
export const useCategorias = (lenguajeId: number | null) => {
  const {
    data: categorias = [],
    isLoading,
    error,
    refetch
  } = useQuery<CategoriaTematica[], Error>({
    queryKey: ['categorias', lenguajeId],
    queryFn: () => categoriasService.obtenerCategoriasPorLenguaje(lenguajeId!),
    enabled: !!lenguajeId, // Solo ejecuta si hay un lenguaje seleccionado
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false
  })

  return {
    categorias,
    isLoading,
    error: error?.message,
    refetch
  }
}
