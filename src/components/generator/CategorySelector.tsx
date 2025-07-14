import { motion } from 'framer-motion'
import { FolderOpen, ChevronDown } from 'lucide-react'
import { useCategorias } from '../../hooks/useCategorias'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'
import type { CategoriaTematica } from '../../types/api'

interface CategorySelectorProps {
  lenguajeId: number | null
  selectedCategoria: CategoriaTematica | null
  onCategoriaSelect: (categoria: CategoriaTematica) => void
  className?: string
}

/**
 * Componente selector de categorías temáticas
 * 
 * Características:
 * - Carga dinámica de categorías según lenguaje seleccionado
 * - Animaciones suaves con Framer Motion
 * - Estados de carga elegantes
 * - Diseño moderno y responsive
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  lenguajeId,
  selectedCategoria,
  onCategoriaSelect,
  className
}) => {
  const { categorias, isLoading, error } = useCategorias(lenguajeId)

  if (!lenguajeId) {
    return (
      <motion.div
        className={cn('bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <FolderOpen className="w-5 h-5 mr-2 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Selecciona una Categoría
          </h3>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-center py-8">
          Primero debes seleccionar un lenguaje de programación
        </p>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <FolderOpen className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selecciona una Categoría
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <FolderOpen className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Error al cargar categorías
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
        <FolderOpen className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona una Categoría
        </h3>
      </div>

      <div className="space-y-3">
        {categorias.map((categoria, index) => (
          <motion.button
            key={categoria.id}
            onClick={() => onCategoriaSelect(categoria)}
            className={cn(
              'w-full p-4 text-left rounded-lg border-2 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500',
              selectedCategoria?.id === categoria.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
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
                  {categoria.nombre}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {categoria.descripcion}
                </p>
              </div>
              <ChevronDown 
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                  selectedCategoria?.id === categoria.id && 'rotate-180'
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {selectedCategoria && (
        <motion.div
          className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ Categoría seleccionada: <strong>{selectedCategoria.nombre}</strong>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
