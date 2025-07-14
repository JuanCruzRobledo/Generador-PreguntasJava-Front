import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../utils/cn'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Componente botón para alternar entre modo claro y oscuro
 * 
 * Características:
 * - Animaciones suaves con Framer Motion
 * - Iconos animados (Sol/Luna)
 * - Diferentes tamaños
 * - Tooltip descriptivo
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md'
}) => {
  const { theme, toggleTheme, isDark } = useTheme()
  
  console.log('ThemeToggle render - theme:', theme, 'isDark:', isDark)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative rounded-full border-2 transition-all duration-300',
        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
      >
        <Sun className={cn('text-yellow-500', iconSizes[size])} />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
      >
        <Moon className={cn('text-blue-400', iconSizes[size])} />
      </motion.div>
    </motion.button>
  )
}
