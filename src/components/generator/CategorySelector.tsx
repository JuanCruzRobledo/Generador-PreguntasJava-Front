import { motion } from 'framer-motion'
import { FolderOpen, ChevronDown, Tag, X } from 'lucide-react'
import { useCategorias } from '../../hooks/useCategorias'
import { useTags } from '../../hooks/useTags'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'
import type { CategoriaTematica, TagTematica } from '../../types/api'

interface CategorySelectorProps {
  lenguajeId: number | null
  selectedCategoria: CategoriaTematica | null
  onCategoriaSelect: (categoria: CategoriaTematica) => void
  selectedTags: TagTematica[]
  onTagToggle: (tag: TagTematica) => void
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
  selectedTags,
  onTagToggle,
  className
}) => {
  const { categorias, isLoading, error } = useCategorias(lenguajeId)
  const { tags, isLoading: isLoadingTags, error: errorTags } = useTags(selectedCategoria?.id ?? null)

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
        {/* TODO: revisar implementación - usar assertion temporal para evitar errores */}
        {(categorias as any[]).map((categoria: any, index: any) => (
          <div key={categoria.id}>
            <motion.button
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
            
            {/* Tags para esta categoría específica */}
            {selectedCategoria?.id === categoria.id && (
              <motion.div
                className="mt-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-3">
                  <Tag className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Tags (Opcional)
                  </h4>
                </div>
                
                {isLoadingTags ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, tagIndex) => (
                      <Skeleton key={tagIndex} width="80px" height="32px" />
                    ))}
                  </div>
                ) : errorTags ? (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errorTags}</p>
                ) : (tags as any[]).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {/* TODO: revisar implementación - usar assertion temporal para evitar errores */}
                    {(tags as any[]).map((tag: any, tagIndex: any) => {
                      const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id)
                      
                      return (
                        <motion.button
                          key={tag.id}
                          onClick={() => onTagToggle(tag)}
                          className={cn(
                            'flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
                            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500',
                            isSelected
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-500'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500'
                          )}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: tagIndex * 0.05 }}
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
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No hay tags disponibles para esta categoría
                  </p>
                )}
                
                {selectedTags.length > 0 && (
                  <motion.div
                    className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
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
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
