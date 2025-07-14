import React, { useState } from 'react'
import { ArrowRight, Play, RotateCcw } from 'lucide-react'
import { usePreguntaContext } from '../contexts/PreguntaContext'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import PreguntaCard from './PreguntaCard'
import { LanguageSelector } from './generator/LanguageSelector'
import { CategorySelector } from './generator/CategorySelector'
import { TagSelector } from './generator/TagSelector'
import { DifficultySelector } from './generator/DifficultySelector'
import { Dificultad, type GenerarPreguntaRequest, type Pregunta, type PreguntaRespondida, type Lenguaje, type CategoriaTematica, type TagTematica } from '../types/api'

/**
 * Componente principal para manejar la generación de preguntas de programación
 * 
 * Con flujo: Lenguaje - Categoría - Tags - Dificultad - Generar Pregunta
 */
export const PreguntaGenerator: React.FC = () => {
  const {
    pregunta,
    isGenerandoPregunta,
    isValidandoRespuesta,
    error,
    generarPregunta,
    reiniciar,
    limpiarError,
    validarRespuesta,
    respuestaSeleccionada,
    seleccionarRespuesta,
    resultado,
  } = usePreguntaContext()

  const [selectedLenguaje, setSelectedLenguaje] = useState<Lenguaje | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaTematica | null>(null)
  const [selectedTags, setSelectedTags] = useState<TagTematica[]>([])
  const [selectedDificultad, setSelectedDificultad] = useState<Dificultad | null>(Dificultad.MEDIA)

  const handleTagToggle = (tag: TagTematica) => {
    if (selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
      setSelectedTags(prev => prev.filter(t => t.id !== tag.id))
    } else {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const onSubmit = async () => {
    if (!selectedLenguaje || !selectedCategoria) return

    const request: GenerarPreguntaRequest = {
      lenguajeId: selectedLenguaje.id,
      categoriaId: selectedCategoria.id,
      tagsTematicas: selectedTags.map(tag => tag.nombre),
      dificultad: selectedDificultad ?? undefined
    }

    try {
      await generarPregunta(request)
    } catch (error) {
      console.error('Error al generar pregunta:', error)
    }
  }

  const handleNuevaPregunta = () => {
    reiniciar()
    setSelectedLenguaje(null)
    setSelectedCategoria(null)
    setSelectedTags([])
    setSelectedDificultad(Dificultad.MEDIA)
  }

  const handleRespuestaSeleccionada = async (respuesta: string) => {
    if (!pregunta?.id || respuestaSeleccionada) return

    try {
      seleccionarRespuesta(respuesta)
      await validarRespuesta(pregunta.id, respuesta)
    } catch (error) {
      console.error('Error al validar respuesta:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generador de Preguntas de Programación</h1>
        <p className="text-gray-600 dark:text-gray-300">Selecciona las opciones deseadas para generar preguntas personalizadas</p>
      </div>

      {error && <ErrorAlert error={error} onClose={limpiarError} />}

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LanguageSelector
          selectedLenguaje={selectedLenguaje}
          onLenguajeSelect={setSelectedLenguaje}
        />
        <CategorySelector
          lenguajeId={selectedLenguaje?.id ?? null}
          selectedCategoria={selectedCategoria}
          onCategoriaSelect={setSelectedCategoria}
        />
        <TagSelector
          categoriaId={selectedCategoria?.id ?? null}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        <DifficultySelector
          selectedDificultad={selectedDificultad}
          onDificultadSelect={setSelectedDificultad}
        />
      </div>

      {/* Botón para generar pregunta */}
      <div className="text-center">
        <Button
          onClick={onSubmit}
          variant="primary"
          size="lg"
          isLoading={isGenerandoPregunta}
          disabled={isGenerandoPregunta || !selectedLenguaje || !selectedCategoria}
          className="min-w-48"
        >
          <Play className="w-5 h-5 mr-2" />
          Generar Pregunta
        </Button>
      </div>

      {/* Loading spinner */}
      {isGenerandoPregunta && (<LoadingSpinner size="lg" text="Generando pregunta..." />)}

      {/* Muestra la pregunta generada */}
      {pregunta && (
        <div className="space-y-6">
          <PreguntaCard
            pregunta={pregunta}
            respuestaSeleccionada={respuestaSeleccionada}
            onRespuestaSeleccionada={handleRespuestaSeleccionada}
            isDisabled={!!respuestaSeleccionada || isValidandoRespuesta}
            resultado={resultado}
          />

          <div className="text-center space-x-4">
            <Button onClick={handleNuevaPregunta} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Nueva Generación
            </Button>
            <Button
              onClick={onSubmit}
              variant="outline"
              size="lg"
              disabled={!selectedLenguaje || !selectedCategoria}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Siguiente Pregunta
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PreguntaGenerator
