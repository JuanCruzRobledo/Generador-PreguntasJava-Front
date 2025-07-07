import PreguntaGenerator from '../components/PreguntaGenerator'

export default function GeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generador de Preguntas Java
        </h1>
        <p className="text-gray-600">
          Genera preguntas de programación Java y pon a prueba tus conocimientos
        </p>
      </div>

      <PreguntaGenerator />
    </div>
  )
}
