import React, { type ReactNode } from 'react'
import { PreguntaProvider } from './PreguntaContext'
import { HistorialProvider } from './HistorialContext'
import { UserProvider } from './UserContext'
import { AuthProvider } from './AuthContext'

interface AppProviderProps {
  children: ReactNode
}

/**
 * 🏗️ Proveedor principal de la aplicación
 * 
 * Estructura jerárquica de contextos:
 * 1. AuthProvider - Maneja autenticación con cookies HttpOnly
 * 2. UserProvider - Gestión de usuarios (compatible con sistema actual)
 * 3. PreguntaProvider - Estado de preguntas
 * 4. HistorialProvider - Historial de preguntas respondidas
 * 
 * El AuthProvider envuelve a todos los demás para que cualquier contexto
 * pueda acceder al estado de autenticación cuando sea necesario.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <PreguntaProvider>
          <HistorialProvider>{children}</HistorialProvider>
        </PreguntaProvider>
      </UserProvider>
    </AuthProvider>
  )
}
