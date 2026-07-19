# Docker y Kubernetes - Frontend (hr-platform-web)

Este documento explica cómo se empaqueta el frontend en una imagen Docker, cómo se publica automáticamente en Docker Hub y cómo se despliega en Kubernetes. También detalla dos bugs reales que se encontraron y corrigieron durante las pruebas: un problema de build con `useSearchParams()` y un problema de red con el servidor standalone de Next.js dentro de contenedores.

Este documento es específico de Docker/Kubernetes. Para la guía de despliegue en Vercel (una estrategia de despliegue distinta y ya existente en este repositorio), ver [`docs/DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md). Para la visión general de todo el sistema (backend + frontend + base de datos, en local y en Kubernetes), ver [`docs/ORQUESTACION_Y_DESPLIEGUE.md`](../../docs/ORQUESTACION_Y_DESPLIEGUE.md) en la raíz del proyecto.

---

## 1. La imagen Docker

El [`Dockerfile`](../Dockerfile) usa una construcción en tres etapas (*multi-stage build*), aprovechando el modo `standalone` de Next.js:

### Etapa 1: `deps`

- Parte de `node:20-alpine`.
- Instala las dependencias con `npm ci --frozen-lockfile` (instalación reproducible: usa exactamente las versiones fijadas en `package-lock.json`, y falla si el `lockfile` no está sincronizado con `package.json`).

### Etapa 2: `builder`

- Copia `node_modules` ya instalado desde `deps` y el resto del código fuente.
- Recibe `NEXT_PUBLIC_API_URL` como argumento de build (`ARG` + `ENV`). Esto es importante: cualquier variable que empiece con `NEXT_PUBLIC_` en Next.js queda **incrustada dentro del bundle de JavaScript en tiempo de build**, no se lee en tiempo de ejecución. Si se necesita apuntar a otra URL de API, hay que reconstruir la imagen con un valor distinto, no alcanza con cambiar una variable de entorno del contenedor ya construido.
- Corre `npm run build`, que genera la carpeta `.next/standalone`: una versión de la aplicación empaquetada junto con únicamente las dependencias de Node que realmente necesita en producción (Next.js analiza el árbol de dependencias y descarta lo que no se usa), lo que reduce mucho el tamaño de la imagen final comparado con copiar todo `node_modules`.

### Etapa 3: `runtime`

- Vuelve a partir de `node:20-alpine`, limpia.
- Copia solamente tres cosas desde `builder`: `.next/standalone` (el servidor y las dependencias mínimas), `.next/static` (los archivos estáticos con hash, como JS y CSS compilados) y `public` (archivos públicos como imágenes).
- Crea un usuario sin privilegios (`appuser`) y corre el contenedor con ese usuario.
- Expone el puerto 3000 y arranca con `node server.js` (el servidor que Next.js genera automáticamente en modo `standalone`).

### Construir la imagen manualmente (sin `docker-compose`)

```bash
cd hr-platform-web
docker build -t hr-platform-web:local --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 .
docker run --rm -p 3000:3000 hr-platform-web:local
```

---

## 2. Publicación automática en Docker Hub

El workflow [`.github/workflows/docker-publish.yml`](../.github/workflows/docker-publish.yml) se dispara con cada `push` a las ramas `main` o `principal`. Construye la imagen (pasándole `NEXT_PUBLIC_API_URL` como build-arg, tomado de una variable de repositorio opcional o, por defecto, apuntando al Ingress de Kubernetes) y la publica en Docker Hub con dos etiquetas:

- `wily12/hr-platform-web:latest`
- `wily12/hr-platform-web:<sha-del-commit>`

Usa los mismos secretos `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN` que el backend (ver el documento de orquestación general para cómo generarlos).

### Rama protegida

A diferencia del backend, **este repositorio tiene protegida la rama `main`**: no acepta `git push` directo, solo Pull Requests aprobados y mergeados. El flujo para publicar un cambio es:

```bash
git checkout -b fix/nombre-descriptivo
# hacer los cambios y commitear
git push -u origin fix/nombre-descriptivo
# abrir el Pull Request en GitHub y mergearlo hacia main
```

Recién cuando el PR se mergea a `main` se dispara el workflow de Docker (y también los otros workflows del repositorio, como `Frontend Integration (CI)` y `Frontend Deployment (CD)`, que son independientes de este pipeline de contenedores).

---

## 3. Despliegue en Kubernetes

El manifiesto [`k8s/06-frontend.yaml`](../../k8s/06-frontend.yaml) (en la raíz del proyecto) define:

- Un `Deployment` con **2 réplicas**, estrategia `RollingUpdate` (`maxSurge: 1`, `maxUnavailable: 0`): igual que el backend, nunca se apaga un Pod viejo hasta que el nuevo esté listo.
- `readinessProbe` y `livenessProbe` por TCP sobre el puerto 3000.
- Límites de recursos (CPU y memoria).
- Un `Service` de tipo `ClusterIP` que expone el Deployment dentro del clúster en el puerto 3000.

---

## 4. Bug corregido: `useSearchParams()` sin límite `Suspense`

### Síntoma

Al construir la imagen (`npm run build` dentro del `Dockerfile`), el build fallaba con:

```
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/empleado/login"
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/superadmin/auditoria"
Error occurred prerendering page "/empleado/login"
Error occurred prerendering page "/superadmin/auditoria"
```

### Causa raíz

En el App Router de Next.js 14, cuando una página se genera de forma estática (pre-renderizada en tiempo de build), el hook `useSearchParams()` no tiene forma de saber los parámetros de la URL en ese momento (no existe una request real todavía). Next.js exige que cualquier componente que use este hook esté envuelto en un límite `<Suspense>`, de forma que esa parte específica de la página pueda quedar pendiente de renderizarse en el cliente (donde sí hay una URL real) sin bloquear el resto de la página ni el build completo.

Esto afectaba a dos páginas:

- `src/app/(empleado)/empleado/login/page.tsx`: usaba `useSearchParams()` para leer un parámetro `redirect` y decidir a dónde mandar al usuario después de iniciar sesión.
- `src/app/(superadmin)/superadmin/auditoria/page.tsx`: usaba `useSearchParams()` para inicializar un filtro (`empresa`) a partir de la URL.

### Solución aplicada

En ambos casos, se extrajo el contenido de la página a un componente interno, y se dejó el `export default` de la página como un envoltorio que renderiza ese componente dentro de un `<Suspense>`:

```tsx
// Antes
export default function EmpleadoLoginPage() {
    const searchParams = useSearchParams();
    // ... resto del componente
}

// Después
export default function EmpleadoLoginPage() {
    return (
        <Suspense fallback={null}>
            <EmpleadoLoginForm />
        </Suspense>
    );
}

function EmpleadoLoginForm() {
    const searchParams = useSearchParams();
    // ... resto del componente, sin cambios
}
```

Se usó `fallback={null}` porque ambas páginas ya muestran su propio estado de carga interno (formularios, tablas con `isLoading`), así que no hacía falta un spinner adicional mientras se resuelve el límite de Suspense (que en la práctica es casi instantáneo).

### Cómo evitar este bug en páginas nuevas

Cualquier página nueva del App Router que use `useSearchParams()`, `usePathname()` combinado con parámetros dinámicos, o hooks similares que dependan de información de la URL en el cliente, debe seguir este mismo patrón: separar la lógica en un componente interno y envolverlo en `<Suspense>` desde el `export default` de la página. Esto solo aplica a Client Components (`"use client"`) que se renderizan dentro de páginas que Next.js intenta pre-renderizar estáticamente; no hace falta en rutas marcadas explícitamente como dinámicas.

---

## 5. Bug corregido: el servidor escuchaba solo en la IP del Pod, no en `0.0.0.0`

### Síntoma

Con la aplicación ya desplegada y corriendo en Kubernetes (los Pods se mostraban `Running` y `1/1 Ready`), intentar acceder al frontend con `kubectl port-forward` fallaba:

```
kubectl port-forward -n nexushr svc/frontend 13000:3000
...
error: lost connection to pod
Unhandled Error: ... failed to connect to localhost:3000 inside namespace ...:
dial tcp4 127.0.0.1:3000: connect: connection refused
```

Sin embargo, el tráfico que llegaba a través del `Service` de Kubernetes (por ejemplo, desde otro Pod del clúster) sí funcionaba correctamente.

### Causa raíz

El servidor `server.js` que genera el modo `standalone` de Next.js decide en qué dirección IP escuchar leyendo la variable de entorno `HOSTNAME` (si no está definida, usa `0.0.0.0`, es decir, todas las interfaces de red).

El problema es que **Kubernetes inyecta automáticamente una variable de entorno `HOSTNAME` en cada Pod, con el nombre del propio Pod** (por ejemplo, `frontend-5f884f7bd-dgr2p`). Al arrancar, `server.js` toma ese valor, lo resuelve a una dirección IP (que dentro del Pod resuelve a su propia IP interna, por ejemplo `10.244.0.8`) y hace el `bind` del socket específicamente a esa IP, en lugar de a `0.0.0.0`.

Esto tiene dos consecuencias:

- El tráfico que llega **desde afuera del Pod** dirigido a esa IP específica (como el que enruta el `Service` de Kubernetes) funciona sin problema, porque el destino coincide exactamente con la IP donde el servidor sí está escuchando.
- El tráfico que intenta llegar por **`localhost` / `127.0.0.1` dentro del propio Pod** (como hace `kubectl port-forward`, o como haría cualquier sidecar, proxy de malla de servicios, o una prueba con `wget localhost:3000` ejecutada con `kubectl exec`) no encuentra nada escuchando ahí, y la conexión se rechaza.

Se confirmó este diagnóstico ejecutando dentro del propio Pod:

```bash
kubectl exec -n nexushr <pod-frontend> -- sh -c "wget -qO- http://localhost:3000/; ss -tlnp"
```

lo cual mostró el socket escuchando en `10.244.0.8:3000`, no en `0.0.0.0:3000` ni en `127.0.0.1:3000`.

### Solución aplicada

Se fijó explícitamente la variable `HOSTNAME` a `0.0.0.0` en el `Dockerfile`, para que no dependa de lo que Kubernetes (o cualquier otro orquestador) inyecte automáticamente:

```dockerfile
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
```

Esta es, de hecho, la configuración que recomienda la documentación oficial de Next.js para contenedores con salida `standalone`. Al reconstruir la imagen con este cambio y volver a desplegarla, el servidor pasó a escuchar en todas las interfaces, y tanto el tráfico por `Service` como por `port-forward`/`localhost` funcionaron correctamente.

### Cómo se verificó la corrección

1. Se corrigió el `Dockerfile` y se subió el cambio mediante un Pull Request (ver sección 2, "Rama protegida").
2. Al mergear el PR, el workflow reconstruyó y republicó la imagen `wily12/hr-platform-web:latest`.
3. Se aplicó un rolling update en el clúster:

   ```bash
   kubectl rollout restart deployment/frontend -n nexushr
   kubectl rollout status deployment/frontend -n nexushr
   ```

4. Una vez terminado el rollout (Pods nuevos reemplazando a los viejos, sin caída de servicio), se repitió la prueba de `kubectl port-forward -n nexushr svc/frontend 13000:3000` seguida de una petición HTTP, y esta vez respondió `200 OK` correctamente.

### Por qué importa este bug más allá de `port-forward`

Aunque el síntoma que lo hizo visible fue una herramienta de diagnóstico (`port-forward`), el mismo problema afectaría a cualquier mecanismo que dependa de `localhost` dentro del contenedor: un `livenessProbe`/`readinessProbe` configurado como `exec` en lugar de `tcpSocket` (por ejemplo, uno que hiciera `curl http://localhost:3000/health`), un sidecar de logging o de métricas, o un proxy de service mesh como Istio o Linkerd, que típicamente interceptan el tráfico localmente antes de reenviarlo. Por eso, aunque el Service ya funcionaba, corregir el `bind` a `0.0.0.0` es la solución correcta y no un simple parche para el síntoma puntual.
