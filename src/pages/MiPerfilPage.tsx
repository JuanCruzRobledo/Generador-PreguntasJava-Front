import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usuarioService } from '../services/usuarioService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { User, Edit2, Save, X, Calendar, Shield, Mail, AlertCircle } from 'lucide-react';

const MiPerfilPage = () => {
  const { user, refreshAuth } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setMensaje(null);

    try {
      await usuarioService.actualizarPerfil(user.id, formData);
      await refreshAuth();
      setMensaje({ tipo: 'success', texto: '¡Perfil actualizado correctamente!' });
      setEditMode(false);
    } catch (error: any) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.message || 'Error al actualizar el perfil. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        avatar: user.avatar || '',
      });
    }
    setEditMode(false);
    setMensaje(null);
  };

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`Avatar de ${user.nombre}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                {user.activo && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.nombreParaMostrar || user.nombre}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setEditMode(!editMode)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Editar</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              mensaje.tipo === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <p>{mensaje.texto}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de edición */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {editMode ? 'Editar información' : 'Información personal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full px-3 py-2 border rounded-md transition-colors duration-200 ${
                    editMode
                      ? 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  required
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar (URL)
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="https://ejemplo.com/mi-avatar.jpg"
                  className={`w-full px-3 py-2 border rounded-md transition-colors duration-200 ${
                    editMode
                      ? 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                />
                {formData.avatar && (
                  <div className="mt-3">
                    <img
                      src={formData.avatar}
                      alt="Vista previa del avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              {editMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar cambios</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </Button>
                </motion.div>
              )}
            </form>
          </div>

          {/* Información del sistema */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Detalles de la cuenta
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Fecha de registro */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha de registro
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatearFecha(user.fechaRegistro)}
                  </p>
                </div>
              </div>

              {/* Último acceso */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Último acceso
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatearFecha(user.ultimoAcceso)}
                  </p>
                </div>
              </div>

              {/* Estado de la cuenta */}
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la cuenta
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.activo ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.activo ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ID de usuario */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID de usuario
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MiPerfilPage;
