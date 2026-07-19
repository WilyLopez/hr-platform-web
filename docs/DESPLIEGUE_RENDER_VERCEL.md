# Guía paso a paso: desplegar en Render y Vercel (gratis)

Esta guía explica cómo publicar NexusHR en internet usando únicamente planes gratuitos: **Render** para el backend y su base de datos PostgreSQL, **Upstash** para Redis, y **Vercel** para el frontend. No requiere tarjeta de crédito en ninguno de los tres servicios para el uso que necesita este proyecto.

Esta ruta **no usa** los contenedores Docker Hub ni los manifiestos de `k8s/` que se armaron para la demo de Kubernetes (Vercel construye el frontend directamente desde el código fuente, y Render construye el backend desde el `Dockerfile` pero sin pasar por Kubernetes). Ver [`RESUMEN_Y_JUSTIFICACION_DESPLIEGUE.md`](./RESUMEN_Y_JUSTIFICACION_DESPLIEGUE.md) para el porqué de esta separación.

El orden de los pasos importa, porque el backend necesita a Redis antes de arrancar, y el frontend necesita conocer la URL final del backend.

---

## Paso 0: qué se dejó ya preparado en el código

- `hr-platform-api/render.yaml`: describe automáticamente el servicio web y la base de datos para Render (lo que Render llama un "Blueprint"). No hay que crear nada a mano en el panel salvo completar algunas variables de entorno.
- `hr-platform-api/config/settings/production.py`: ya incluye `SECURE_PROXY_SSL_HEADER` (necesario porque Render termina el HTTPS antes de reenviar la petición al contenedor; sin esto se produce un bucle infinito de redirecciones) y `STATICFILES_STORAGE` con WhiteNoise (sirve los archivos estáticos, incluido el panel de administración, sin necesitar un servidor aparte).
- `hr-platform-api/shared/interfaces/health.py` y la ruta `/health/`: endpoint público que Render usa para saber si el contenedor ya está listo para recibir tráfico.
- `hr-platform-web/next.config.js`: ya tiene precargado el dominio esperado del backend (`hr-platform-api.onrender.com`) en `images.domains`, para que `next/image` pueda cargar imágenes que vengan de la API.

---

## Paso 1: Redis gratuito con Upstash

Render dejó de ofrecer un plan gratuito de Redis, así que se usa [Upstash](https://upstash.com), que sí tiene un nivel gratuito permanente pensado exactamente para este caso.

1. Crear una cuenta en Upstash (se puede usar la cuenta de GitHub para registrarse).
2. Crear una base de datos nueva de tipo **Redis**. Elegir una región cercana a donde vaya a estar el backend (Render por defecto usa Oregon, EE.UU.).
3. Una vez creada, copiar el valor **"Redis URL"** en formato `rediss://` (con dos "s", indica que la conexión usa TLS). Se va a necesitar en el paso 2.

---

## Paso 2: Backend en Render

1. Crear una cuenta en [Render](https://render.com) (se puede usar GitHub para registrarse; esto además le da acceso a Render para leer el repositorio).
2. En el panel, click en **New +** > **Blueprint**.
3. Seleccionar el repositorio `hr-platform-api`. Render detecta automáticamente el archivo `render.yaml` en la raíz y muestra un resumen: un servicio web (`hr-platform-api`) y una base de datos (`nexushr-db`).
4. Antes de confirmar, Render va a pedir completar las variables marcadas como `sync: false` en `render.yaml` (no tienen un valor por defecto porque dependen de datos externos):
   - `REDIS_URL`: pegar la URL de Upstash del paso 1.
   - `CORS_ALLOWED_ORIGINS`: por ahora, poner `https://hr-platform-web.vercel.app` (el nombre más probable; se ajusta en el paso 4 si Vercel termina asignando otro).
   - `CSRF_TRUSTED_ORIGINS`: el mismo valor que `CORS_ALLOWED_ORIGINS`.
5. Click en **Apply** / **Create**. Render va a construir la imagen Docker, crear la base de datos, correr `python manage.py migrate` automáticamente (definido como `preDeployCommand` en el Blueprint) y arrancar el servicio.
6. La primera vez tarda varios minutos (build de la imagen + aprovisionamiento de la base de datos). Se puede seguir el progreso en la pestaña **Logs** del servicio.
7. Cuando termine, Render muestra la URL pública del servicio (debería ser `https://hr-platform-api.onrender.com`, salvo que ese nombre ya esté en uso por otra cuenta, en cuyo caso Render le agrega un sufijo). Verificar que responda:

   ```
   https://hr-platform-api.onrender.com/health/
   ```

   Debería devolver `{"status": "ok"}`.

### Crear un usuario administrador (opcional, para entrar a /admin/)

Render Shell (acceso a una terminal del contenedor) no está disponible en el plan gratuito. La alternativa es usar el modo no interactivo de Django:

1. En el panel del servicio, ir a **Environment** y agregar temporalmente:
   - `DJANGO_SUPERUSER_USERNAME`
   - `DJANGO_SUPERUSER_EMAIL`
   - `DJANGO_SUPERUSER_PASSWORD`
2. Ir a la pestaña **Jobs** (o **Shell**, si el plan lo permite) y correr una vez:

   ```
   python manage.py createsuperuser --noinput
   ```

3. Borrar la variable `DJANGO_SUPERUSER_PASSWORD` del entorno una vez creado el usuario, para no dejar la contraseña guardada en texto plano en la configuración del servicio.

---

## Paso 3: Frontend en Vercel

1. Crear una cuenta en [Vercel](https://vercel.com) (con GitHub, igual que Render).
2. Click en **Add New** > **Project**, y seleccionar el repositorio `hr-platform-web`.
3. Vercel detecta automáticamente que es un proyecto Next.js; no hace falta tocar el **Build Command** ni el **Output Directory**.
4. En **Environment Variables**, agregar:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://hr-platform-api.onrender.com/api/v1` (la URL real de Render del paso 2) |

   Importante: como esta variable empieza con `NEXT_PUBLIC_`, Vercel la incrusta dentro del código JavaScript en el momento del build. Si más adelante cambia la URL del backend, hay que actualizar esta variable y volver a desplegar (**Redeploy**) para que el cambio tenga efecto.

5. Click en **Deploy**. Vercel construye y publica el sitio; al terminar entrega una URL del tipo `https://hr-platform-web.vercel.app` (o con algún sufijo si ese nombre ya está tomado).

---

## Paso 4: cerrar el círculo (CORS)

Si la URL final que asignó Vercel en el paso 3 es distinta a `https://hr-platform-web.vercel.app` (la que se puso como valor provisional en el paso 2), hay que corregirla:

1. Volver al panel de Render, entrar al servicio `hr-platform-api`.
2. En **Environment**, actualizar `CORS_ALLOWED_ORIGINS` y `CSRF_TRUSTED_ORIGINS` con la URL real de Vercel.
3. Guardar. Render vuelve a desplegar el servicio automáticamente con la variable nueva (no hace falta reconstruir la imagen, solo reinicia el proceso con el entorno actualizado).

Sin este paso, el navegador va a bloquear las peticiones del frontend hacia el backend con un error de CORS, aunque ambos servicios estén corriendo correctamente.

---

## Verificación final

1. Abrir la URL de Vercel en el navegador.
2. Probar el flujo de login (por ejemplo, `/empleado/login` o `/superadmin/login`, según cómo esté armado el enrutamiento del frontend).
3. Revisar en las herramientas de desarrollador del navegador (pestaña Network) que las peticiones a `hr-platform-api.onrender.com` respondan `200`/`401` según corresponda, y no queden bloqueadas por CORS ni devuelvan `502`.

---

## Limitaciones del plan gratuito (a tener en cuenta)

- **Cold start en Render**: el servicio web gratuito "se duerme" tras 15 minutos sin recibir tráfico. La primera petición después de ese período tarda entre 30 y 50 segundos en responder mientras el contenedor vuelve a arrancar. Las peticiones siguientes son normales.
- **Base de datos gratuita con vencimiento**: el PostgreSQL gratuito de Render expira 90 días después de creado (Render avisa por correo antes de que pase). Para conservar los datos hay que exportarlos (`pg_dump`) antes del vencimiento, o pasar a un plan pago.
- **Límites de Upstash gratuito**: el nivel gratuito tiene un tope de comandos por día, más que suficiente para uso de demo, pero no pensado para tráfico real sostenido.
- **Sin dominio propio**: por defecto todo queda bajo `onrender.com` y `vercel.app`. Ambos servicios permiten conectar un dominio propio de forma gratuita si se cuenta con uno (el costo sería solo el del dominio en sí, no el de estos servicios).

---

## Solución de problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Redirección infinita / el navegador dice "demasiadas redirecciones" | Falta `SECURE_PROXY_SSL_HEADER` o Render no está enviando `X-Forwarded-Proto` | Ya está configurado en `production.py`; si persiste, revisar que `DJANGO_SETTINGS_MODULE=config.settings.production` esté bien seteado en Render |
| Error de CORS en la consola del navegador | La URL de Vercel no coincide con `CORS_ALLOWED_ORIGINS` en Render | Repetir el Paso 4 con la URL exacta (incluyendo `https://`, sin `/` final) |
| El panel `/admin/` carga sin estilos (CSS roto) | WhiteNoise no logró recolectar los estáticos en el build | Revisar los logs de build en Render buscando errores de `collectstatic`; puede requerir que `SECRET_KEY` esté disponible también en tiempo de build |
| El backend tarda mucho en la primera petición | Cold start del plan gratuito (ver sección anterior) | Normal en el plan gratuito; no requiere acción |
| `relation "..." does not exist` al usar la API | Las migraciones no llegaron a correr | Revisar en los logs de Render que el `preDeployCommand` (`python manage.py migrate`) se haya ejecutado sin errores |
