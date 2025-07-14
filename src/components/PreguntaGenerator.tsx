import React, { useState } from 'react'
import { ArrowRight, Play, RotateCcw, ChevronDown } from 'lucide-react' // TODO: revisar implementación - ChevronUp eliminado
import { motion, AnimatePresence } from 'framer-motion'
import { usePreguntaContext } from '../contexts/PreguntaContext'
import Button from './ui/Button'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorAlert from './ui/ErrorAlert'
import PreguntaCard from './PreguntaCard'
import { LanguageSelector } from './generator/LanguageSelector'
import { CategorySelector } from './generator/CategorySelector'
import { DifficultySelector } from './generator/DifficultySelector'
import { Dificultad, type GenerarPreguntaRequest, type Lenguaje, type CategoriaTematica, type TagTematica } from '../types/api'
// TODO: revisar implementación - Pregunta y PreguntaRespondida comentados por no usarse

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
  const [isLanguageVisible, setIsLanguageVisible] = useState(true);
  const [showGenerationOptions, setShowGenerationOptions] = useState(true); // Controla si mostrar las opciones

  const toggleLanguageVisibility = () => {
    setIsLanguageVisible(prev => !prev);
  }

  const handleLenguajeSelect = (lenguaje: Lenguaje) => {
    setSelectedLenguaje(lenguaje);
    // Ocultar automáticamente el selector después de seleccionar
    setIsLanguageVisible(false);
    // Limpiar categoría y tags al cambiar de lenguaje
    setSelectedCategoria(null);
    setSelectedTags([]);
  }

  const handleCategoriaSelect = (categoria: CategoriaTematica) => {
    setSelectedCategoria(categoria)
    // Limpiar tags al cambiar de categoría
    setSelectedTags([])
  }

  const handleTagToggle = (tag: TagTematica) => {
    if (selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
      setSelectedTags(prev => prev.filter(t => t.id !== tag.id))
    } else {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const onSubmit = async () => {
    if (!selectedLenguaje || !selectedCategoria) return

    // Ocultar opciones de generación cuando se empieza a generar
    setShowGenerationOptions(false)

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
      // Si hay error, mostrar opciones de nuevo
      setShowGenerationOptions(true)
    }
  }

  const handleNuevaPregunta = () => {
    reiniciar()
    setSelectedLenguaje(null)
    setSelectedCategoria(null)
    setSelectedTags([])
    setSelectedDificultad(Dificultad.MEDIA)
    setIsLanguageVisible(true)
    setShowGenerationOptions(true) // Mostrar opciones de generación
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

      {/* Opciones de generación - solo se muestran antes de generar */}
      {showGenerationOptions && (
        <div className="space-y-4">
        {/* Selector de Lenguaje */}
        <div>
          <motion.button 
            onClick={toggleLanguageVisibility} 
            className="w-full mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border-2 border-blue-300 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center">
              {selectedLenguaje ? (
                <span>Lenguaje: <strong>{selectedLenguaje.nombre}</strong></span>
              ) : (
                <span>Seleccionar Lenguaje</span>
              )}
            </span>
            <motion.div
              animate={{ rotate: isLanguageVisible ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {isLanguageVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LanguageSelector
                  selectedLenguaje={selectedLenguaje}
                  onLenguajeSelect={handleLenguajeSelect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Selector de Categoría */}
        <CategorySelector
          lenguajeId={selectedLenguaje?.id ?? null}
          selectedCategoria={selectedCategoria}
          onCategoriaSelect={handleCategoriaSelect}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        
        {/* Selector de Dificultad */}
        <DifficultySelector
          selectedDificultad={selectedDificultad}
          onDificultadSelect={setSelectedDificultad}
        />
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
        </div>
      )}

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
