import { useQuery } from '@tanstack/react-query'
import { lenguajesService } from '../services/lenguajesService'
import type { Lenguaje } from '../types/api'

/**
 * Hook personalizado para manejar lenguajes de programación
 * 
 * Proporciona:
 * - Lista de lenguajes disponibles
 * - Estado de carga
 * - Manejo de errores
 * - Caché automático
 */
export const useLenguajes = () => {
  const {
    data: lenguajes = [],
    isLoading,
    error,
    refetch
  } = useQuery<Lenguaje[], Error>({
    queryKey: ['lenguajes'],
    queryFn: lenguajesService.obtenerLenguajes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // TODO: revisar implementación - cacheTime no soportado en esta versión de react-query
    // cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false
  })

  return {
    lenguajes,
    isLoading,
    error: error?.message,
    refetch
  }
}
