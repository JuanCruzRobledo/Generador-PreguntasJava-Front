import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'

/**
 * 🚨 Página de error para OAuth2
 * 
 * Esta página se muestra cuando hay un error durante
 * la autenticación con Google OAuth2.
 */
const OAuth2ErrorPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // Obtener mensaje de error desde los parámetros de URL
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      let message = 'Error en la autenticación con Google'
      
      // Personalizar mensajes de error comunes
      switch (error) {
        case 'access_denied':
          message = 'Acceso denegado. Has cancelado la autenticación con Google.'
          break
        case 'invalid_request':
          message = 'Solicitud inválida. Hay un problema con la configuración de OAuth2.'
          break
        case 'unauthorized_client':
          message = 'Cliente no autorizado. Problema de configuración del servidor.'
          break
        case 'unsupported_response_type':
          message = 'Tipo de respuesta no soportado.'
          break
        case 'invalid_scope':
          message = 'Alcance inválido solicitado.'
          break
        case 'server_error':
          message = 'Error del servidor de Google. Intenta de nuevo más tarde.'
          break
        case 'temporarily_unavailable':
          message = 'Servicio temporalmente no disponible. Intenta de nuevo más tarde.'
          break
        default:
          if (errorDescription) {
            message = `${error}: ${errorDescription}`
          } else {
            message = `Error: ${error}`
          }
      }
      
      setErrorMessage(message)
    } else {
      setErrorMessage('Error desconocido en la autenticación con Google')
    }
  }, [searchParams])

  const handleRetry = () => {
    // Redirigir de vuelta a la página de login
    navigate('/login', { replace: true })
  }

  const handleContactSupport = () => {
    // Aquí podrías redirigir a una página de soporte o abrir un email
    window.open('mailto:support@example.com?subject=Error en OAuth2&body=' + encodeURIComponent(errorMessage))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
            Error en la Autenticación
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No se pudo completar la autenticación con Google
          </p>
        </div>

        {/* Mensaje de error */}
        <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Detalles del Error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Opciones de acción */}
        <div className="space-y-4">
          <Button
            onClick={handleRetry}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Intentar de Nuevo
          </Button>

          <Button
            onClick={handleContactSupport}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactar Soporte
          </Button>
        </div>

        {/* Enlace de vuelta al login */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Volver al Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default OAuth2ErrorPage
