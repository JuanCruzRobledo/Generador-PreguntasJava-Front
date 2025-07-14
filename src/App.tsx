import { RouterProvider } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { router } from './router'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
