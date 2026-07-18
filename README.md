# NexusRH - Web Frontend

Aplicación web frontend para la plataforma SaaS de Gestión de Recursos Humanos NexusRH. Construida sobre Next.js 14 (App Router), React, Tailwind CSS y TypeScript.

## Tecnologias

* React 18 / Next.js 14 (App Router)
* Tailwind CSS / PostCSS - Estilos y diseño responsivo
* TypeScript - Tipado estático y robustez del código
* TanStack Query (React Query) - Gestión de estado asíncrono y caché de servidor
* Zustand - Gestión de estado global del cliente (sesión y autenticación)
* React Hook Form / Zod - Validación y control de formularios
* Axios - Cliente HTTP para la comunicación con la API
* Recharts - Biblioteca de gráficos interactivos para el panel de control
* Lucide React - Set de iconos modernos y consistentes

---

## Requisitos Previos

* Node.js 18.x o superior
* Administrador de paquetes npm (incluido con Node.js) o yarn

---

## Instalacion Local

### 1. Clonar y acceder al directorio

```bash
git clone <repositorio>
cd hr-platform-web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copie el archivo de ejemplo a su entorno local:

```bash
cp .env.example .env.local
```

Abra el archivo `.env.local` y configure la URL de la API del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abra http://localhost:3000 en su navegador para ver la aplicación ejecutándose.

---

## Actualizar el Proyecto (Para Compañeros de Equipo)

Cuando otro miembro del equipo realice cambios en el repositorio (por ejemplo, al añadir nuevos paquetes o componentes), sincronice su entorno local ejecutando:

```bash
# 1. Traer los últimos cambios
git pull origin develop

# 2. Instalar dependencias nuevas o modificadas
npm install
```

---

## Estructura del Proyecto

El código fuente está estructurado de la siguiente forma dentro del directorio `src`:

```
hr-platform-web/
├── public/                    # Archivos estáticos públicos (imágenes, logos)
├── src/
│   ├── app/                  # Rutas bajo Next.js App Router
│   │   ├── (admin)/          # Vistas para el perfil de Administrador de Empresa
│   │   ├── (auth)/           # Vistas de autenticación pública (login, recuperación)
│   │   ├── (empleado)/       # Vistas específicas para Colaboradores/Empleados
│   │   ├── (landing)/        # Página de inicio pública y registro de empresas
│   │   ├── (propietario)/    # Vistas de configuración del Propietario de la Empresa (SaaS)
│   │   ├── (superadmin)/     # Módulo de administración del sistema SaaS
│   │   └── layout.tsx        # Layout global del frontend
│   ├── components/           # Componentes de UI y formularios reutilizables
│   │   ├── forms/            # Formularios complejos estructurados
│   │   ├── UI/               # Botones, tarjetas, skeletons, modales
│   │   └── layout/           # Barras superiores, barras laterales de navegación
│   ├── hooks/                # Hooks personalizados de React
│   ├── lib/                  # Inicializaciones de librerías externas (ej: Axios config)
│   ├── middleware.ts         # Middleware para control de rutas y protección por JWT
│   ├── services/             # Clases de servicio para peticiones HTTP
│   ├── store/                # Estados de Zustand (ej: auth.store.ts)
│   ├── types/                # Definiciones y tipos de TypeScript
│   └── utils/                # Utilidades, formateadores y constantes del sistema
```

---

## Scripts Disponibles

En el directorio del proyecto, puede ejecutar los siguientes comandos mediante npm:

```bash
# Inicia el servidor de desarrollo
npm run dev

# Compila la aplicación optimizada para producción
npm run build

# Inicia el servidor de Next.js con la build de producción compilada
npm run start

# Ejecuta el linter de ESLint para revisar la calidad del código
npm run lint

# Verifica la consistencia y ausencia de errores de tipado de TypeScript
npm run type-check
```

---

## Despliegue en Produccion

La aplicación está preparada para ser desplegada en plataformas compatibles con Next.js (como Vercel o servidores auto-alojados con Node.js / Docker).

### Variables de entorno para produccion

Asegúrese de configurar las siguientes variables en su entorno de alojamiento:

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api/v1
PORT=3000
NODE_ENV=production
```

### Docker

El proyecto incluye un archivo `Dockerfile` configurado para compilación en múltiples etapas (multi-stage build), reduciendo el peso de la imagen final de producción.

Para compilar y ejecutar la imagen localmente:

```bash
# Construir la imagen de Docker
docker build -t nexusrh-frontend .

# Ejecutar el contenedor
docker run -p 3000:3000 nexusrh-frontend
```

---

## Licencia

NexusRH. Todos los derechos reservados.
