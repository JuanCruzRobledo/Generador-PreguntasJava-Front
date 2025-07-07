import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import { usePreguntaContext } from '../contexts/PreguntaContext'
import { useHistorialContext } from '../contexts/HistorialContext'
import { apiService } from '../services/apiService'

export default function Layout() {
  const { error: preguntaError, reiniciar: resetPregunta } =
    usePreguntaContext()
  const {
    error: historialError,
    cargarPreguntas: loadHistorial,
    cargarTematicas: loadTematicas,
  } = useHistorialContext()
  const [backendStatus, setBackendStatus] = useState<
    'checking' | 'online' | 'offline'
  >('checking')
  const [error, setError] = useState<string | null>(null)

  // Verificar estado del backend al cargar la aplicación
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await apiService.verificarSaludBackend()
        setBackendStatus('online')
        setError(null)
      } catch (err) {
        setBackendStatus('offline')
        setError(
          'No se puede conectar con el servidor backend. Verifica que esté ejecutándose.'
        )
      }
    }

    checkBackendHealth()
  }, [])

  // Cargar datos iniciales cuando el backend esté disponible
  useEffect(() => {
    if (backendStatus === 'online') {
      loadHistorial()
      loadTematicas()
    }
  }, [backendStatus, loadHistorial, loadTematicas])

  const renderContent = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            Verificando conexión con el servidor...
          </p>
        </div>
      )
    }

    if (backendStatus === 'offline') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <ErrorAlert error="No se puede conectar con el servidor backend" />
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar conexión
            </button>
          </div>
        </div>
      )
    }

    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation backendStatus={backendStatus} />

      <main className="pt-6">
        {error && (
          <div className="max-w-4xl mx-auto px-6 mb-6">
            <ErrorAlert error={error} onClose={() => setError(null)} />
          </div>
        )}

        {(preguntaError || historialError) && (
          <div className="max-w-4xl mx-auto px-6 mb-6">
            <ErrorAlert
              error={preguntaError || historialError || ''}
              onClose={() => {
                // Reset errors when dismissed
                if (preguntaError) resetPregunta()
              }}
            />
          </div>
        )}

        {renderContent()}
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500">
          <p>
            Generador de Preguntas Java - Desarrollado con React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  )
}
