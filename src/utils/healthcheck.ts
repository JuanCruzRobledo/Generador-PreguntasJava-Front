import { apiService } from '../services/apiService'

/**
 * Verifica que el backend esté funcionando correctamente
 * @returns Promise<boolean> true si el backend está funcionando
 */
export const verificarBackend = async (): Promise<boolean> => {
  try {
    const saludBackend = await apiService.verificarSaludBackend()
    
    if (saludBackend) {
      console.log('✅ Backend conectado correctamente')
      return true
    } else {
      console.warn('⚠️ Backend no responde')
      return false
    }
  } catch (error) {
    console.error('❌ Error al conectar con el backend:', error)
    return false
  }
}

/**
 * Función de prueba para validar todo el flujo completo
 */
export const probarFlujoCompleto = async () => {
  console.log('🧪 Iniciando prueba del flujo completo...')
  
  try {
    // 1. Verificar backend
    const backendOk = await verificarBackend()
    if (!backendOk) {
      throw new Error('Backend no disponible')
    }
    
    // 2. Obtener temáticas disponibles (temporalmente deshabilitado)
    console.log('📋 Obteniendo temáticas... (deshabilitado temporalmente)')
    const tematicas: any[] = []
    console.log(`✅ ${tematicas.length} temáticas encontradas:`, tematicas.map((t: any) => t.nombre))
    
    // 3. Generar una pregunta de prueba
    console.log('🎯 Generando pregunta de prueba...')
    const pregunta = await apiService.generarPregunta({})
    console.log('✅ Pregunta generada:', {
      id: pregunta.id,
      enunciado: pregunta.enunciado.substring(0, 50) + '...',
      opciones: pregunta.opciones.length,
      dificultad: pregunta.dificultad
    })
    
    // 4. Validar una respuesta (tomamos la primera opción)
    if (pregunta.opciones.length > 0) {
      console.log('🎯 Validando respuesta de prueba...')
      const primeraOpcion = pregunta.opciones[0].contenido
      const validacion = await apiService.validarRespuesta({
        preguntaId: pregunta.id,
        opcionSeleccionada: primeraOpcion
      })
      
      console.log('✅ Validación completada:', {
        esCorrecta: validacion.esCorrecta,
        respuestaCorrecta: validacion.respuestaCorrecta,
        explicacion: validacion.explicacion.substring(0, 50) + '...'
      })
    }
    
    console.log('🎉 ¡Flujo completo ejecutado exitosamente!')
    return true
    
  } catch (error) {
    console.error('❌ Error en el flujo completo:', error)
    return false
  }
}
