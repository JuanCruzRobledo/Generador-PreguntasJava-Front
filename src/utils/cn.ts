import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de CSS con soporte para condicionales
 * Utiliza clsx para manejar condicionales y twMerge para evitar conflictos de Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
