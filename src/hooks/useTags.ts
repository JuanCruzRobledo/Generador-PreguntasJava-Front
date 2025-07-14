import { useQuery } from '@tanstack/react-query'
import { tagsService } from '../services/tagsService'
import type { TagTematica } from '../types/api'

/**
 * Hook personalizado para manejar tags temáticos
 * 
 * Proporciona:
 * - Lista de tags por categoría
 * - Estado de carga
 * - Manejo de errores
 * - Caché automático
 */
export const useTags = (categoriaId: number | null) => {
  const {
    data: tags = [],
    isLoading,
    error,
    refetch
  } = useQuery<TagTematica[], Error>({
    queryKey: ['tags', categoriaId],
    queryFn: () => tagsService.obtenerTagsPorCategoria(categoriaId!),
    enabled: !!categoriaId, // Solo ejecuta si hay una categoría seleccionada
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false
  })

  return {
    tags,
    isLoading,
    error: error?.message,
    refetch
  }
}
