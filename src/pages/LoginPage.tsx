import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usuarioService } from '../services/usuarioService'
import { LoginForm } from '../components/auth/LoginForm'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const [guestError, setGuestError] = useState<string | null>(null)

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // También verificar el método anterior por compatibilidad
  useEffect(() => {
    if (usuarioService.estaAutenticado()) {
      navigate('/')
    }
  }, [navigate])

  const handleInvitado = async () => {
    try {
      setIsGuestLoading(true)
      setGuestError(null)
      await usuarioService.crearUsuarioAnonimo()
      navigate('/') // Redirigir al dashboard
    } catch (error) {
      console.error('Error al iniciar como invitado:', error)
      setGuestError('No se pudo iniciar sesión como invitado. Intenta de nuevo.')
    } finally {
      setIsGuestLoading(false)
    }
  }

  // Mostrar spinner mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Verificando autenticación...
          </p>
        </div>
      </div>
    )
  }

  // Si se debe mostrar el formulario de login completo
  if (showLoginForm) {
    return (
      <LoginForm 
        onBack={() => setShowLoginForm(false)}
        showBackButton={true}
      />
    )
  }

  // Página de bienvenida con opciones de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 🏢 Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Generador de Preguntas Java
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Practica programación con preguntas personalizadas
          </p>
        </div>

        {/* 🚨 Error de invitado */}
        {guestError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {guestError}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setGuestError(null)}
                  className="inline-flex rounded-md bg-red-50 dark:bg-red-900 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔐 Opciones de acceso */}
        <div className="space-y-4">
          {/* Botón de Login con cuenta */}
          <Button
            onClick={() => setShowLoginForm(true)}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Iniciar Sesión con Cuenta
          </Button>

          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">O</span>
            </div>
          </div>

          {/* Botón de invitado */}
          <Button
            onClick={handleInvitado}
            disabled={isGuestLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGuestLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            )}
            {isGuestLoading ? 'Iniciando...' : 'Continuar como Invitado'}
          </Button>
        </div>

        {/* 🔗 Enlaces adicionales */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => setShowLoginForm(true)}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Regístrate aquí
            </button>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Al usar esta aplicación, aceptas nuestros términos de servicio
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
