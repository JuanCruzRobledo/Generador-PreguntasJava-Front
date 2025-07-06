import React, { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import PreguntaGenerator from './components/PreguntaGenerator'
import Historial from './components/Historial'
import TematicasStats from './components/TematicasStats'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorAlert from './components/ui/ErrorAlert'
import { usePreguntaContext } from './contexts/PreguntaContext'
import { useHistorialContext } from './contexts/HistorialContext'
import { AppProvider } from './contexts/AppContext'
import { apiService } from './services/apiService'
import './App.css'

type ActiveView = 'generator' | 'historial' | 'stats'

function AppContent() {
  const {
    pregunta,
    isLoading: preguntaLoading,
    error: preguntaError,
    generarPregunta: generatePregunta,
    responder: checkRespuesta,
    reiniciar: resetPregunta,
    limpiarError: limpiarPreguntaError,
  } = usePreguntaContext()
  const {
    preguntas: historial,
    tematicas,
    isLoading: historialLoading,
    error: historialError,
    cargarPreguntas: loadHistorial,
    cargarTematicas: loadTematicas,
    aplicarFiltroTematica: filterHistorial,
  } = useHistorialContext()
  const [activeView, setActiveView] = useState<ActiveView>('generator')
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

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view)
    setError(null)

    // Recargar datos cuando cambiamos a ciertas vistas
    if (view === 'historial' && backendStatus === 'online') {
      loadHistorial()
    } else if (view === 'stats' && backendStatus === 'online') {
      loadTematicas()
    }
  }

  const handleGeneratePregunta = async (
    tematica: string,
    dificultad?: string
  ) => {
    setError(null)
    try {
      await generatePregunta({
        tematica_deseada: tematica,
        dificultad: dificultad,
      })
    } catch (err) {
      setError('Error al generar la pregunta. Inténtalo de nuevo.')
    }
  }

  const handleCheckRespuesta = async (respuesta: string) => {
    setError(null)
    try {
      const result = await checkRespuesta(respuesta)
      // Recargar historial y estadísticas después de responder
      if (backendStatus === 'online') {
        loadHistorial()
        loadTematicas()
      }
      return result
    } catch (err) {
      setError('Error al verificar la respuesta. Inténtalo de nuevo.')
      throw err
    }
  }

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

    switch (activeView) {
      case 'generator':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Generador de Preguntas Java
              </h1>
              <p className="text-gray-600">
                Genera preguntas de programación Java y pon a prueba tus
                conocimientos
              </p>
            </div>

            <PreguntaGenerator
              pregunta={pregunta}
              isLoading={preguntaLoading}
              onGenerate={handleGeneratePregunta}
              onCheckRespuesta={handleCheckRespuesta}
              onReset={resetPregunta}
            />
          </div>
        )

      case 'historial':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Historial de Preguntas
              </h1>
              <p className="text-gray-600">
                Revisa las preguntas que has respondido anteriormente
              </p>
            </div>

            <Historial
              historial={historial}
              tematicas={tematicas}
              isLoading={historialLoading}
              onFilter={filterHistorial}
            />
          </div>
        )

      case 'stats':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Estadísticas por Temática
              </h1>
              <p className="text-gray-600">
                Analiza tu progreso en diferentes temas de programación Java
              </p>
            </div>

            <TematicasStats
              tematicas={tematicas}
              isLoading={historialLoading}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeView={activeView}
        onViewChange={handleViewChange}
        backendStatus={backendStatus}
      />

      <main className="pt-6">
        {error && (
          <div className="max-w-4xl mx-auto px-6 mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {(preguntaError || historialError) && (
          <div className="max-w-4xl mx-auto px-6 mb-6">
            <ErrorAlert
              message={preguntaError || historialError || ''}
              onDismiss={() => {
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

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
