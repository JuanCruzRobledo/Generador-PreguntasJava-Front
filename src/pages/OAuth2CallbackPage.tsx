import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import authService from '../services/authService'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

/**
 * 🔐 Página de callback para OAuth2 exitoso
 * 
 * Esta página se muestra cuando el usuario regresa desde Google
 * después de una autenticación exitosa con OAuth2.
 */
const OAuth2CallbackPage = () => {
  const navigate = useNavigate()
  const { refreshAuth } = useAuth()

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        // Verificar el estado de autenticación después de OAuth2
        const user = await authService.checkOAuth2Status()
        
        if (user) {
          // ✅ Usuario autenticado exitosamente
          // Actualizar el estado de autenticación
          await refreshAuth()
          
          // Redirigir al dashboard
          navigate('/', { replace: true })
        } else {
          // ❌ No se pudo obtener el usuario
          navigate('/login', { 
            replace: true,
            state: { error: 'No se pudo completar la autenticación con Google' }
          })
        }
      } catch (error) {
        console.error('Error en callback OAuth2:', error)
        
        // Redirigir al login con error
        navigate('/login', { 
          replace: true,
          state: { error: 'Error al procesar la autenticación con Google' }
        })
      }
    }

    handleOAuth2Callback()
  }, [navigate, refreshAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <LoadingSpinner size="lg" />
        
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          Completando autenticación...
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Te estamos redirigiendo a tu dashboard
        </p>
      </div>
    </div>
  )
}

export default OAuth2CallbackPage
