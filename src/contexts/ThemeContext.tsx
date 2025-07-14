import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Función helper para obtener el tema inicial
 */
const getInitialTheme = (): Theme => {
  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    // Intentar obtener tema desde localStorage
    const savedTheme = localStorage.getItem('app-theme')
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      console.log('Tema desde localStorage:', savedTheme)
      return savedTheme
    }
    
    // Si no hay tema guardado, usar preferencia del sistema
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemTheme = systemPrefersDark ? 'dark' : 'light'
    console.log('Tema desde sistema:', systemTheme)
    return systemTheme
  } catch (error) {
    console.warn('Error al obtener tema inicial:', error)
    return 'light'
  }
}

/**
 * Proveedor del contexto de tema
 * 
 * Características:
 * - Persiste el tema en localStorage
 * - Aplica automáticamente la clase 'dark' al documento
 * - Respeta la preferencia del sistema si no hay tema guardado
 * - Debugging mejorado
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Aplicar tema al documento cuando cambie
  useEffect(() => {
    const root = document.documentElement
    
    console.log('Aplicando tema:', theme)
    
    // Remover todas las clases de tema
    root.classList.remove('light', 'dark')
    
    // Aplicar la clase del tema actual
    root.classList.add(theme)
    
    // Guardar en localStorage
    try {
      localStorage.setItem('app-theme', theme)
      console.log('Tema guardado en localStorage:', theme)
    } catch (error) {
      console.warn('Error al guardar tema:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme)
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      console.log('New theme will be:', newTheme)
      return newTheme
    })
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}
