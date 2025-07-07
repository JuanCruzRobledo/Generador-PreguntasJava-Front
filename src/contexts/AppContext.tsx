import React, { type ReactNode } from 'react'
import { PreguntaProvider } from './PreguntaContext'
import { HistorialProvider } from './HistorialContext'
import { UserProvider } from './UserContext'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <PreguntaProvider>
        <HistorialProvider>{children}</HistorialProvider>
      </PreguntaProvider>
    </UserProvider>
  )
}
