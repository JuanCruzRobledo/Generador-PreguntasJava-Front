import { motion } from 'framer-motion'
import { Target, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Dificultad } from '../../types/api'

interface DifficultySelectorProps {
  selectedDificultad: Dificultad | null
  onDificultadSelect: (dificultad: Dificultad) => void
  className?: string
}

const dificultadOptions = [
  {
    value: Dificultad.FACIL,
    label: 'Fácil',
    description: 'Conceptos básicos y sintaxis fundamental',
    icon: Zap,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-500'
  },
  {
    value: Dificultad.MEDIA,
    label: 'Media',
    description: 'Lógica intermedia y casos de uso comunes',
    icon: Target,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-500'
  },
  {
    value: Dificultad.DIFICIL,
    label: 'Difícil',
    description: 'Conceptos avanzados y casos complejos',
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-500'
  }
]

/**
 * Componente selector de dificultad
 * 
 * Características:
 * - Selección visual de niveles de dificultad
 * - Animaciones suaves con Framer Motion
 * - Iconos descriptivos para cada nivel
 * - Diseño moderno y responsive
 */
export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDificultad,
  onDificultadSelect,
  className
}) => {
  return (
    <motion.div
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona la Dificultad
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Elige el nivel de complejidad para tu pregunta (por defecto: Media)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dificultadOptions.map((option, index) => {
          const Icon = option.icon
          const isSelected = selectedDificultad === option.value
          
          return (
            <motion.button
              key={option.value}
              onClick={() => onDificultadSelect(option.value)}
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                isSelected
                  ? `${option.borderColor} ${option.bgColor} ${option.color}`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center mb-2">
                <Icon className={cn('w-5 h-5 mr-2', isSelected ? option.color : 'text-gray-400')} />
                <span className={cn(
                  'font-medium',
                  isSelected ? option.color : 'text-gray-900 dark:text-white'
                )}>
                  {option.label}
                </span>
              </div>
              <p className={cn(
                'text-sm',
                isSelected ? option.color : 'text-gray-600 dark:text-gray-400'
              )}>
                {option.description}
              </p>
            </motion.button>
          )
        })}
      </div>

      {selectedDificultad && (
        <motion.div
          className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            ✅ Dificultad seleccionada: <strong>{
              dificultadOptions.find(opt => opt.value === selectedDificultad)?.label
            }</strong>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
