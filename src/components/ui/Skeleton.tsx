import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  rows?: number
}

/**
 * Componente Skeleton para mostrar estados de carga elegantes
 * 
 * Características:
 * - Animación de shimmer suave
 * - Diferentes variantes (text, circular, rectangular)
 * - Responsive y customizable
 * - Soporte para múltiples filas de texto
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  rows = 1
}) => {
  const skeletonVariants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  }

  if (variant === 'text' && rows > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
              'animate-pulse',
              skeletonVariants[variant]
            )}
            style={{
              width: index === rows - 1 ? '75%' : width,
              height
            }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        'animate-pulse',
        skeletonVariants[variant],
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}

// Skeleton presets comunes
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md', className)}>
    <div className="space-y-4">
      <Skeleton width="60%" height="24px" />
      <Skeleton variant="text" rows={3} />
      <div className="flex space-x-2">
        <Skeleton width="80px" height="32px" />
        <Skeleton width="80px" height="32px" />
      </div>
    </div>
  </div>
)

export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height="16px" />
          <Skeleton width="50%" height="14px" />
        </div>
      </div>
    ))}
  </div>
)
