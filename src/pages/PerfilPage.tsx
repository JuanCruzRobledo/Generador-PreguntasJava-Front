import { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { usuarioService } from '../services/usuarioService'

const PerfilPage = () => {
  const { usuario, setUsuario } = useUserContext()
  const [formData, setFormData] = useState({
    nombre: '',
    avatar: '',
  })

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        avatar: usuario.avatar || '',
      })
    }
  }, [usuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario?.id) return

    setLoading(true)
    setMensaje(null)

    try {
      const actualizado = await usuarioService.actualizarPerfil(
        usuario.id,
        formData
      )
      setUsuario(actualizado)
      setMensaje('Perfil actualizado correctamente.')
    } catch (error: any) {
      setMensaje(error.message || 'Error al actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Avatar (URL)</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Avatar Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        {mensaje && (
          <p
            className={`mt-2 ${
              mensaje.includes('correctamente')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
      </form>
    </div>
  )
}

export default PerfilPage
