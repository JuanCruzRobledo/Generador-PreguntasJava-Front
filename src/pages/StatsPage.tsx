import TematicasStats from '../components/TematicasStats'

export default function StatsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estadísticas por Temática
        </h1>
        <p className="text-gray-600">
          Analiza tu progreso en diferentes temas de programación Java
        </p>
      </div>

      <TematicasStats />
    </div>
  )
}
