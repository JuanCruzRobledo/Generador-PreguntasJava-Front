import { motion } from 'framer-motion'
import { Tag, X } from 'lucide-react'
import { useTags } from '../../hooks/useTags'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'
import type { TagTematica } from '../../types/api'

interface TagSelectorProps {
  categoriaId: number | null
  selectedTags: TagTematica[]
  onTagToggle: (tag: TagTematica) => void
  className?: string
}

/**
 * Componente selector de tags temáticos
 * 
 * Características:
 * - Carga dinámica de tags según categoría seleccionada
 * - Selección múltiple con animaciones
 * - Estados de carga elegantes
 * - Diseño moderno y responsive
 */
export const TagSelector: React.FC<TagSelectorProps> = ({
  categoriaId,
  selectedTags,
  onTagToggle,
  className
}) => {
  const { tags, isLoading, error } = useTags(categoriaId)

  if (!categoriaId) {
    return (
      <motion.div
        className={cn('bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <Tag className="w-5 h-5 mr-2 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Selecciona Tags (Opcional)
          </h3>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-center py-8">
          Primero debes seleccionar una categoría
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
          <Tag className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selecciona Tags (Opcional)
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} width="80px" height="32px" />
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
          <Tag className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Error al cargar tags
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
        <Tag className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona Tags (Opcional)
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Selecciona uno o más tags para generar preguntas más específicas
      </p>

      <div className="flex flex-wrap gap-2">
        {/* TODO: revisar implementación - usar assertion temporal para evitar errores */}
        {(tags as any[]).map((tag: any, index: any) => {
          const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id)
          
          return (
            <motion.button
              key={tag.id}
              onClick={() => onTagToggle(tag)}
              className={cn(
                'flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500',
                isSelected
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tag.nombre}</span>
              {tag.contadorUsos > 0 && (
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {tag.contadorUsos}
                </span>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2"
                >
                  <X className="w-3 h-3" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {selectedTags.length > 0 && (
        <motion.div
          className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-purple-700 dark:text-purple-300">
            ✅ {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} seleccionado{selectedTags.length > 1 ? 's' : ''}:
            <strong className="ml-1">
              {selectedTags.map(tag => tag.nombre).join(', ')}
            </strong>
          </p>
        </motion.div>
      )}

      {/* TODO: revisar implementación - usar assertion temporal para evitar errores */}
      {(tags as any[]).length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500 dark:text-gray-400">
            No hay tags disponibles para esta categoría
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
