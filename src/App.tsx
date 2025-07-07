import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { router } from './router'
import './App.css'

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

export default App
