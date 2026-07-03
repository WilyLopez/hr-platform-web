# 📋 Manual de Gestión de Incidentes y Niveles de Servicio (SLAs)
## Plataforma SaaS de Gestión de Recursos Humanos

Este documento define el marco de trabajo, los canales de atención y los compromisos de servicio (SLA) para la gestión de incidentes dentro de la plataforma SaaS de Recursos Humanos, centralizados a través de **Jira Service Management**.

---

## 1. Canales de Registro de Incidentes

Todos los clientes corporativos del SaaS disponen de tres vías integradas para reportar anomalías o solicitar asistencia:

1. **Portal de Autoservicio (Help Center):** Una interfaz web limpia donde el usuario selecciona la categoría de su problema (Planillas, Asistencias, Usuarios) y completa un formulario estructurado.
2. **Correo Electrónico Dedicado:** Los correos enviados a `soporte@hr-platform-saas.com` crean automáticamente un ticket de soporte con prioridad por defecto.
3. **Widget Integrado en la Aplicación:** Un botón de ayuda dentro del Dashboard del Frontend (`hr-platform-web`) que abre un formulario flotante enviando metadatos contextuales automáticamente (ID de empresa, rol, ruta del error).

---

## 2. Clasificación de Incidentes y Matriz de Prioridades

Para garantizar un flujo óptimo, los incidentes se categorizan según su **Impacto** (cuántos usuarios/procesos se ven afectados) y su **Urgencia** (cuanto tiempo puede esperar el negocio).

| Categoría de Incidente | Urgencia | Impacto | Prioridad Resultante |
| :--- | :--- | :--- | :--- |
| **Bloqueo de Procesos Críticos** (Ej. Falla total en el cálculo o pago de planillas de fin de mes, caída del servicio de marcaje QR). | Alta | Crítico (Toda la Empresa) | **P1 - Crítica (Alta)** |
| **Degradación del Servicio** (Ej. Lentitud severa en la carga del Dashboard de asistencia, fallas intermitentes al subir justificaciones). | Media | Moderado (Un área o sede) | **P2 - Media** |
| **Consultas o Cambios Menores** (Ej. Error estético en tipografías, solicitud de cambio de logo empresarial, duda sobre configuración). | Baja | Bajo (Usuario individual) | **P3 - Baja** |

---

## 3. Acuerdos de Nivel de Servicio (SLAs)

Los tiempos máximos de atención están configurados de forma estricta en **Jira Service Management** y disparan alertas automatizadas al equipo técnico para evitar penalizaciones o pérdidas de contratos:

### 🕒 Tiempos de Respuesta y Resolución
* **Prioridad P1 (Crítica):**
  * **Tiempo de Respuesta (Primera atención):** < 30 minutos.
  * **Tiempo de Resolución (Solución definitiva):** < 2 horas.
* **Prioridad P2 (Media):**
  * **Tiempo de Respuesta (Primera atención):** < 2 horas.
  * **Tiempo de Resolución (Solución definitiva):** < 12 horas.
* **Prioridad P3 (Baja):**
  * **Tiempo de Respuesta (Primera atención):** < 8 horas.
  * **Tiempo de Resolución (Solución definitiva):** < 48 horas.

---

## 4. Flujo de Ciclo de Vida del Incidente (Workflow)

El ciclo de atención configurado en Jira sigue la siguiente secuencia de estados:

```text
[ Abierto ] ──> [ En Triaje ] ──> [ En Progreso ] ──> [ Validando con Cliente ] ──> [ Resuelto ]