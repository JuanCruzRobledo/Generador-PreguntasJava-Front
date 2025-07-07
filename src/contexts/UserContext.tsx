import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Usuario } from '../types/usuario'
import { usuarioService } from '../services/usuarioService'

interface UserContextType {
  usuario: Usuario | null
  setUsuario: (user: Usuario | null) => void
  cargarUsuario: () => Promise<void>
  cerrarSesion: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const storedUser = usuarioService.obtenerUsuarioLocal()
    if (storedUser) {
      setUsuario(storedUser)
    }
  }, [])

  const cargarUsuario = async () => {
    try {
      const perfil = await usuarioService.obtenerPerfil()
      setUsuario(perfil)
    } catch (error) {
      console.error('Error al cargar el usuario:', error)
    }
  }

  const cerrarSesion = () => {
    usuarioService.limpiarSesion()
    setUsuario(null)
  }

  const contextValue: UserContextType = {
    usuario,
    setUsuario,
    cargarUsuario,
    cerrarSesion,
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext debe usarse dentro de un UserProvider')
  }
  return context
}
