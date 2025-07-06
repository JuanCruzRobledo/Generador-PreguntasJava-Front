# 🎯 Generador de Preguntas Java

Una aplicación web moderna para generar y practicar preguntas de Java con una interfaz bonita e intuitiva.

## ✨ Características

- 🎨 **Interfaz moderna** con React + TypeScript + TailwindCSS
- 🔄 **Generación automática** de preguntas de Java
- 📚 **Múltiples temas**: OOP, Collections, Exceptions, Threads, etc.
- 🎚️ **Niveles de dificultad**: Fácil, Intermedio, Difícil
- ⏱️ **Timer integrado** para seguimiento del tiempo
- 📊 **Estadísticas detalladas** de rendimiento
- 💡 **Explicaciones incluidas** para cada respuesta
- 📱 **Diseño responsivo** para móviles y escritorio
- 🚀 **Optimizado para Vercel**

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, TailwindCSS 4.1
- **Build Tool**: Vite
- **UI Components**: Lucide React
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Deployment**: Vercel

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Tu API de backend ejecutándose

### Configuración local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con la URL de tu API:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📦 Despliegue en Vercel

### Opción 1: Despliegue automático con Git

1. **Conectar repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub/GitLab
   - Vercel detectará automáticamente que es un proyecto Vite

2. **Configurar variables de entorno en Vercel**
   - En el dashboard de Vercel, ve a Settings → Environment Variables
   - Añade las siguientes variables:
   ```
   VITE_API_URL=https://tu-api-desplegada.com/api
   VITE_APP_NAME=Generador de Preguntas Java
   VITE_APP_VERSION=1.0.0
   ```

3. **Desplegar**
   - Vercel desplegará automáticamente en cada push a main
   - Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`

### Opción 2: Despliegue manual con Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel**
   ```bash
   vercel login
   ```

3. **Configurar el proyecto**
   ```bash
   vercel
   ```

4. **Configurar variables de entorno**
   ```bash
   vercel env add VITE_API_URL
   ```

5. **Desplegar a producción**
   ```bash
   vercel --prod
   ```

## ⚙️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Vista previa de build local

# Linting
npm run lint         # Ejecuta ESLint
```

## 🔧 Configuración de la API

La aplicación espera que tu API tenga los siguientes endpoints:

```
GET  /api/health                    # Health check
GET  /api/topics                    # Obtener temas disponibles  
POST /api/questions/generate        # Generar preguntas
GET  /api/questions/topic/:topicId  # Preguntas por tema
POST /api/questions/:id/validate    # Validar respuesta
```

## 🎨 Personalización

### Temas de Java
Puedes modificar los temas disponibles editando el array `javaTopics` en:
```
src/components/QuestionGenerator.tsx
```

### Estilos
- Los estilos están en `src/index.css`
- TailwindCSS 4.1 está configurado con variables CSS personalizadas
- Colores personalizados para Java (naranjas) y primary (azules)

## 🚦 Estados de la Aplicación

- ✅ **Online**: Conectado al servidor, todas las funciones disponibles
- ⚠️ **Checking**: Verificando conexión con el servidor
- ❌ **Offline**: Sin conexión, funciones limitadas

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- 📱 **Móviles**: 320px - 768px
- 📟 **Tablets**: 768px - 1024px  
- 🖥️ **Desktop**: 1024px+

## 📄 Licencia

Este proyecto es para fines educativos - UTN Facultad Regional.

---

**Hecho con ❤️ por estudiantes de la UTN**
