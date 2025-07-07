// Script de testing para usar en la consola del navegador
// Copia y pega este código en la consola del navegador para probar el flujo completo

export const testPreguntaCard = () => {
  console.log('%c🧪 TESTING PREGUNTA CARD', 'color: blue; font-size: 16px; font-weight: bold')
  
  // Ejemplo de datos de prueba que simula la respuesta del backend
  const preguntaEjemplo = {
    id: 1,
    enunciado: "¿Cuál será el resultado de ejecutar este código?",
    codigoJava: `public class Test {
    public static void main(String[] args) {
        int x = 5;
        int y = ++x;
        System.out.println(x + " " + y);
    }
}`,
    dificultad: "MEDIA",
    respuestaCorrecta: "6 6",
    explicacion: "El operador ++x incrementa x antes de asignarlo a y, por lo que ambos valen 6.",
    opciones: [
      { id: 1, contenido: "5 5" },
      { id: 2, contenido: "5 6" },
      { id: 3, contenido: "6 6" },
      { id: 4, contenido: "6 5" }
    ],
    tematicas: [
      { id: 1, nombre: "operadores", contadorUsos: 5, timestampUltimoUso: "2025-01-07T00:00:00Z" }
    ]
  }
  
  console.log('✅ Pregunta de ejemplo:', preguntaEjemplo)
  
  // Simulación de resultado de validación
  const resultadoValidacion = {
    esCorrecta: false,
    explicacion: "El operador ++x incrementa x antes de asignarlo a y, por lo que ambos valen 6.",
    respuestaCorrecta: "6 6"
  }
  
  console.log('✅ Resultado de validación:', resultadoValidacion)
  
  return { preguntaEjemplo, resultadoValidacion }
}

// Para usar en la consola del navegador:
// 1. Abre las herramientas de desarrollador (F12)
// 2. Ve a la pestaña Console
// 3. Pega este código:

/*
// Test de datos
const { preguntaEjemplo, resultadoValidacion } = window.testPreguntaCard?.() || {};

// Verificar que los tipos están correctos
console.log('Opciones procesadas:', preguntaEjemplo?.opciones.map(o => o.contenido));
console.log('Tipo de opciones:', typeof preguntaEjemplo?.opciones[0].contenido);
console.log('Respuesta correcta:', preguntaEjemplo?.respuestaCorrecta);
*/

if (typeof window !== 'undefined') {
  (window as any).testPreguntaCard = testPreguntaCard
}
