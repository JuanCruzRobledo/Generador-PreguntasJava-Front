import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import GeneratorPage from '../pages/GeneratorPage'
import HistorialPage from '../pages/HistorialPage'
import StatsPage from '../pages/StatsPage'
import NotFoundPage from '../pages/NotFoundPage'
import PerfilPage from '../pages/PerfilPage'
import PerfilUsuarioPage from '../pages/PerfilUsuarioPage'
import ProtectedRoute from '../routes/ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import OAuth2CallbackPage from '../pages/OAuth2CallbackPage'
import OAuth2ErrorPage from '../pages/OAuth2ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/oauth2/success',
    element: <OAuth2CallbackPage />,
  },
  {
    path: '/oauth2/error',
    element: <OAuth2ErrorPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <GeneratorPage />,
      },
      {
        path: 'generator',
        element: <GeneratorPage />,
      },
      {
        path: 'historial',
        element: <HistorialPage />,
      },
      {
        path: 'stats',
        element: <StatsPage />,
      },
      {
        path: 'perfil',
        element: <PerfilPage />,
      },
      {
        path: 'usuarios/:id/perfil',
        element: <PerfilUsuarioPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
