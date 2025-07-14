import { motion } from 'framer-motion'
import { Code, ChevronDown } from 'lucide-react'
import { useLenguajes } from '../../hooks/useLenguajes'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'
import type { Lenguaje } from '../../types/api'

interface LanguageSelectorProps {
  selectedLenguaje: Lenguaje | null
  onLenguajeSelect: (lenguaje: Lenguaje) => void
  className?: string
}

/**
 * Componente selector de lenguajes de programación
 * 
 * Características:
 * - Carga dinámica de lenguajes desde API
 * - Animaciones suaves con Framer Motion
 * - Estados de carga elegantes
 * - Diseño moderno y responsive
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLenguaje,
  onLenguajeSelect,
  className
}) => {
  const { lenguajes, isLoading, error } = useLenguajes()

  if (isLoading) {
    return (
      <motion.div
        className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <Code className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selecciona un Lenguaje
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height="60px" />
          ))}
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <Code className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Error al cargar lenguajes
          </h3>
        </div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <Code className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona un Lenguaje
        </h3>
      </div>

      <div className="space-y-3">
        {lenguajes.map((lenguaje, index) => (
          <motion.button
            key={lenguaje.id}
            onClick={() => onLenguajeSelect(lenguaje)}
            className={cn(
              'w-full p-4 text-left rounded-lg border-2 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              selectedLenguaje?.id === lenguaje.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {lenguaje.nombre}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {lenguaje.descripcion}
                </p>
              </div>
              <ChevronDown 
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                  selectedLenguaje?.id === lenguaje.id && 'rotate-180'
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {selectedLenguaje && (
        <motion.div
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ✅ Lenguaje seleccionado: <strong>{selectedLenguaje.nombre}</strong>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
