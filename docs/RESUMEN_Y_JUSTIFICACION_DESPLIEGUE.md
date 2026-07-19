# Resumen del trabajo de despliegue y justificación de por qué no se publicó en vivo

Este documento resume, en un solo lugar, todo el trabajo de despliegue realizado sobre NexusHR usando Docker, Kubernetes, GitHub Actions y Docker Hub, y explica de forma explícita por qué el resultado final es una demostración local reproducible y no una aplicación publicada en un servidor de internet.

Está pensado para poder explicárselo a alguien que no participó en el proceso (por ejemplo, al momento de sustentar el trabajo) sin necesidad de leer todos los documentos técnicos detallados.

---

## 1. Qué se hizo

### 1.1. Se contenerizaron las dos aplicaciones

Se escribió un `Dockerfile` de múltiples etapas para cada aplicación:

- **Backend** (`hr-platform-api`): Python 3.11, Django, empaquetado con Gunicorn y workers de Uvicorn (necesarios porque el proyecto usa Django Channels para WebSockets).
- **Frontend** (`hr-platform-web`, este repositorio): Node 20, Next.js 14 en modo `standalone`, empaquetado con solo las dependencias mínimas necesarias en tiempo de ejecución.

Ambas imágenes se probaron primero en conjunto con `docker-compose.yml`, junto con PostgreSQL y Redis, levantando el stack completo en una sola máquina.

### 1.2. Se automatizó la construcción y publicación de las imágenes

Se creó, en cada repositorio, un workflow de GitHub Actions (`docker-publish.yml`) que construye la imagen y la publica en Docker Hub (`wily12/hr-platform-api` y `wily12/hr-platform-web`) cada vez que hay un cambio aprobado en la rama principal. No hay ningún paso manual de por medio.

### 1.3. Se escribieron los manifiestos de Kubernetes

Se armaron ocho manifiestos (`k8s/00-namespace.yaml` a `k8s/07-ingress.yaml`) que definen un despliegue completo: namespace dedicado, configuración y secretos separados del código, base de datos con almacenamiento persistente, backend y frontend con dos réplicas cada uno, actualizaciones sin caída de servicio, y chequeos de salud.

### 1.4. Se demostró el ciclo completo, dos veces, con cambios reales

No se hicieron pruebas simuladas: se encontraron y corrigieron tres bugs reales del código (dos en este repositorio, uno en el backend) durante las pruebas, y cada corrección se llevó por el pipeline completo:

```
cambio de código -> commit -> push / Pull Request a main
    -> GitHub Actions construye y publica la imagen en Docker Hub
    -> se aplica el cambio en el clúster de Kubernetes (rolling update)
    -> se verifica que el bug quedó resuelto en el entorno desplegado
```

Los bugs corregidos y verificados de esta forma:

- Ocho módulos del backend que no registraban sus modelos de Django correctamente (rompía las migraciones).
- Dos páginas de este frontend que usaban `useSearchParams()` sin el límite `Suspense` que exige Next.js 14 (rompía el build de producción).
- El servidor de Next.js dentro del contenedor, que escuchaba solo en la IP interna del Pod en lugar de todas las interfaces (rompía `kubectl port-forward` y cualquier mecanismo que dependiera de `localhost`).

El detalle técnico completo de cada uno está en [`DOCKER_Y_KUBERNETES.md`](./DOCKER_Y_KUBERNETES.md) (este repositorio) y en el documento equivalente del backend. La guía completa paso a paso, con todos los comandos, está en [`ORQUESTACION_Y_DESPLIEGUE.md`](../../docs/ORQUESTACION_Y_DESPLIEGUE.md), en la raíz del proyecto. El informe organizado según los puntos de evaluación está en [`INFORME_DESPLIEGUE.md`](../../docs/INFORME_DESPLIEGUE.md), también en la raíz.

### 1.5. Dónde corrió todo esto

El clúster de Kubernetes usado para todas las pruebas fue el que trae integrado Docker Desktop (modo `kind`, un solo nodo, corriendo en la misma máquina de desarrollo), no un servidor en internet. Las imágenes sí se publicaron en Docker Hub de forma real y pública, y el pipeline de GitHub Actions corrió de forma real en los servidores de GitHub; lo único que quedó "local" fue el destino final donde Kubernetes ejecutó los contenedores.

---

## 2. Por qué no se publicó en un servidor de internet (deploy en vivo)

Hubo una decisión consciente de no llevar esto a un servidor público, por las siguientes razones:

### 2.1. No era lo que se estaba evaluando

El objetivo de este trabajo era demostrar la **gestión del despliegue**: que el equipo sabe containerizar aplicaciones, automatizar su construcción y publicación, y orquestarlas con actualizaciones controladas. Ese objetivo se cumple igual de bien con un clúster local que con uno en la nube: Kubernetes se comporta exactamente igual sin importar dónde esté el servidor físico, y el pipeline de GitHub Actions -> Docker Hub es idéntico en ambos casos. Pagar o complicar la configuración de un servidor externo no agrega ninguna evidencia adicional sobre el manejo de estas herramientas.

### 2.2. Las alternativas gratuitas rápidas abandonan justamente lo que se quería demostrar

La forma más simple de tener una URL pública gratis (Vercel para el frontend, Render para el backend) **no usa Docker ni Kubernetes en absoluto**: Vercel compila el código de Next.js directamente con su propio sistema, sin leer el `Dockerfile`, y ninguno de los dos servicios usa los manifiestos de `k8s/`. Usar esa ruta hubiera significado abandonar, para la versión "en vivo", exactamente las herramientas que se estaban evaluando.

### 2.3. Mantener el mismo stack en un servidor real tiene costo o complejidad adicional

Para publicar el proyecto en internet usando realmente Docker y Kubernetes (y no otra cosa), la opción viable sin pagar sería instalar un Kubernetes ligero (por ejemplo `k3s`) sobre una máquina virtual gratuita de por vida, como las que ofrece el nivel gratuito de Oracle Cloud. Es una opción real y se dejó identificada para el futuro, pero implica configurar y mantener un servidor (redes, dominio, certificados, actualizaciones de seguridad del sistema operativo), que es trabajo de administración de infraestructura ajeno al alcance de este trabajo y no aporta evidencia adicional sobre el uso de Docker, Kubernetes, GitHub Actions o Docker Hub que no estuviera ya demostrada localmente.

### 2.4. Conclusión

Se priorizó tener una demostración **reproducible, gratuita y completa** de las cuatro herramientas pedidas, con evidencia real (dos escenarios de cambio de punta a punta, no simulados) por sobre tener una URL pública que, en la práctica, hubiera exigido elegir entre pagar, complicar el alcance del trabajo con administración de servidores, o directamente dejar de usar las herramientas evaluadas.
