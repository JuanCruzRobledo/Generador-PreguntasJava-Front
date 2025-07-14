import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Configurar TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutos
      // TODO: revisar implementación - cacheTime no soportado en esta versión de react-query
      // cacheTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
})

// Scripts de testing en desarrollo
if (import.meta.env.VITE_DEV_MODE === 'true') {
  import('./utils/testing')
  import('./utils/healthcheck').then(({ verificarBackend, probarFlujoCompleto }) => {
    // Hacer funciones disponibles globalmente para testing
    ;(window as any).verificarBackend = verificarBackend
    ;(window as any).probarFlujoCompleto = probarFlujoCompleto
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
