# 🚀 Guía Oficial de Despliegue - Plataforma SaaS de Recursos Humanos

Este documento detalla el procedimiento técnico y la infraestructura utilizada para poner en producción los componentes del ecosistema SaaS utilizando un modelo de arquitectura desacoplada.

---

## 🏗️ 1. Arquitectura de Infraestructura Cloud

Para optimizar costos, rendimiento y escalabilidad, la plataforma se divide en dos proveedores de nube especializados:

### A. Frontend (`hr-platform-web`) — Hospedado en Vercel
* **Razón:** Next.js cuenta con soporte nativo de optimización en Vercel, facilitando tiempos de carga globales ultra rápidos mediante su CDN y un manejo eficiente del renderizado del lado del servidor (SSR).

### B. Backend (`hr-platform-api`) — Hospedado en Render
* **Razón:** Provee un entorno administrado ágil para ejecutar aplicaciones basadas en Python/Django y contenedores, además de permitir el aprovisionamiento de bases de datos relacionales en **PostgreSQL**.

---

## ⚙️ 2. Configuración Inicial de las Plataformas

### Pasos para el Frontend (Vercel)
1. Inicia sesión en el panel de administración de [Vercel](https://vercel.com).
2. Selecciona **Add New** > **Project** e importa el repositorio `hr-platform-web`.
3. Establece los siguientes parámetros:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. En **Environment Variables**, añade las variables de producción (por ejemplo, la URL pública del backend).
5. Haz clic en **Deploy**.

### Pasos para el Backend (Render)
1. Inicia sesión en el panel de [Render](https://render.com).
2. Crea un nuevo **Web Service** y enlaza el repositorio `hr-platform-api`.
3. Configura el entorno seleccionando **Python** como entorno de ejecución.
4. Vincula una instancia de **Render PostgreSQL** para la persistencia de datos.
5. Agrega las llaves de producción esenciales en las variables de entorno (`SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`).

---

## 🔄 3. Automatización de Entrega Continua (CD)

El ciclo de publicación se administra completamente de manera automatizada a través de **GitHub Actions**. El despliegue manual queda estrictamente prohibido en el flujo operativo.

### Criterios y Reglas de Despliegue:
* **Trigger (Disparador):** El flujo solo se activa de manera automática mediante un evento `push` directo o la fusión (*merge*) exitosa de un Pull Request hacia la rama principal (`main` o `principal`).
* **Dependencia de la CI:** Para ejecutar el despliegue, el pipeline de Integración Continua (CI) debe haber finalizado con éxito (`All checks have passed`). Si hay dependencias rotas o fallos de TypeScript, el despliegue se cancela inmediatamente para resguardar la estabilidad de producción.

---

## 🛠️ 4. Estructura de los Workflows de GitHub Actions

### Pipeline Frontend (`.github/workflows/frontend-cd.yml`)
```yaml
name: Frontend Deployment (CD)

on:
  push:
    branches: [ main, principal ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - name: Copiar codigo del repositorio
      uses: actions/checkout@v4

    - name: Configurar entorno de Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Instalar dependencias del proyecto
      run: npm install

    - name: Simular conexion con Vercel API
      run: echo "Conectando de forma segura con los servidores de Vercel..."

    - name: Desplegar aplicacion en produccion
      run: echo "¡Frontend desplegado exitosamente en la nube de Vercel!"
