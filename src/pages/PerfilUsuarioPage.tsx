import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usuarioService } from '../services/usuarioService'
import type { Usuario } from '../types/usuario'

const PerfilUsuarioPage = () => {
  const { id } = useParams<{ id: string }>()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      usuarioService
        .obtenerPorId(Number(id))
        .then(setUsuario)
        .catch(err => {
          const mensaje = err?.message || 'Error al cargar el perfil.'
          setError(mensaje)
        })
    }
  }, [id])

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>
  }

  if (!usuario) {
    return <p className="text-center mt-4">Cargando perfil...</p>
  }

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      {usuario.avatar && (
        <img
          src={usuario.avatar}
          alt={`Avatar de ${usuario.nombre}`}
          className="mx-auto w-32 h-32 rounded-full object-cover mb-4"
        />
      )}
      <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
    </div>
  )
}

export default PerfilUsuarioPage
