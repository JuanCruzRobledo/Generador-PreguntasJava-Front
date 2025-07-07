import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
    <App />
  </StrictMode>,
)
