import { Navigate } from 'react-router-dom'
import { usuarioService } from '../services/usuarioService'
import type { JSX } from 'react'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const estaAutenticado = usuarioService.estaAutenticado()
  return estaAutenticado ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
