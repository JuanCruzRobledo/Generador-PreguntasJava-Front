import React, { type ReactNode } from 'react'
import { PreguntaProvider } from './PreguntaContext'
import { HistorialProvider } from './HistorialContext'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <PreguntaProvider>
      <HistorialProvider>{children}</HistorialProvider>
    </PreguntaProvider>
  )
}
