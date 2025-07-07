import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuarioService } from '../services/usuarioService'

const LoginPage = () => {
  const navigate = useNavigate()

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (usuarioService.estaAutenticado()) {
      navigate('/')
    }
  }, [navigate])

  const handleInvitado = async () => {
    try {
      await usuarioService.crearUsuarioAnonimo()
      navigate('/') // o redirigir al dashboard si tienes uno
    } catch (error) {
      console.error('Error al iniciar como invitado:', error)
      alert('No se pudo iniciar sesión como invitado.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <p className="text-gray-600 mb-6">
          Puedes iniciar sesión o entrar como invitado.
        </p>

        {/* Aquí podrías agregar campos de login más adelante */}

        <button
          onClick={handleInvitado}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Entrar como invitado
        </button>
      </div>
    </div>
  )
}

export default LoginPage
