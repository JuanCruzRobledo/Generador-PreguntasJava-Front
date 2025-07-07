import { useState, useEffect, useCallback } from 'react'
import estadisticasService from '../services/estadisticasService'
import type { EstadisticasUsuario } from '../types/estadisticas'


export const useEstadisticas = (usuarioId: number) => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuario | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const cargarEstadisticas = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await estadisticasService.obtenerEstadisticasUsuario(usuarioId)
      setEstadisticas(data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las estadísticas.')
    } finally {
      setIsLoading(false)
    }
  }, [usuarioId])

  useEffect(() => {
    if (usuarioId) {
      cargarEstadisticas()
    }
  }, [usuarioId, cargarEstadisticas])

  return {
    estadisticas,
    isLoading,
    error,
    refrescar: cargarEstadisticas,
  }
}