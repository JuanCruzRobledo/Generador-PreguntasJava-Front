import Historial from '../components/Historial'

export default function HistorialPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial de Preguntas
        </h1>
        <p className="text-gray-600">
          Revisa las preguntas que has respondido anteriormente
        </p>
      </div>

      <Historial />
    </div>
  )
}
