import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-24 h-24 text-yellow-500" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La página que estás buscando no existe o ha sido movida.
        </p>

        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
