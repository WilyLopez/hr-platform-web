import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

// Rutas de login por rol — deben coincidir con ROLES_LOGIN_PATH en constants.ts
const LOGIN_PATHS: Record<string, string> = {
  SUPERADMIN:  "/superadmin/login",
  PROPIETARIO: "/propietario/login",
  ADMIN:       "/admin/login",
  EMPLEADO:    "/admin/login",
};

/** Obtiene la ruta de login correcta leyendo el usuario persistido en localStorage */
function getLoginPath(): string {
  try {
    const raw = localStorage.getItem("nexus-auth-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      const rol: string | undefined = parsed?.state?.usuario?.rol;
      if (rol && LOGIN_PATHS[rol]) return LOGIN_PATHS[rol];
    }
  } catch {
    // silencioso
  }
  return "/";
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Fuente de verdad del accessToken: sessionStorage (gestionada por authService).
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess: string = data.access;

          // Actualizar en sessionStorage (fuente de verdad) y en el store en memoria
          sessionStorage.setItem("access_token", newAccess);
          // Actualizamos el store en memoria sin importar el módulo para evitar
          // dependencias circulares: escribimos directamente al store de Zustand.
          try {
            const { useAuthStore } = await import("@/store/auth.store");
            useAuthStore.getState().setAccessToken(newAccess);
          } catch { /* silencioso */ }

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch {
          // El refresh falló: limpiar sesión y redirigir al login correcto
          sessionStorage.removeItem("access_token");
          Cookies.remove("refresh_token");
          localStorage.removeItem("nexus-auth-storage");
          if (typeof window !== "undefined") {
            window.location.href = getLoginPath();
          }
        }
      } else {
        // No hay refresh token: redirigir al login correcto
        if (typeof window !== "undefined") {
          window.location.href = getLoginPath();
        }
      }
    } else if (error.response?.status === 403 && (error.response?.data as any)?.code === "COMPANY_SUSPENDED") {
      // Si la empresa fue suspendida, limpiamos sesion inmediatamente
      sessionStorage.removeItem("access_token");
      Cookies.remove("refresh_token");
      localStorage.removeItem("nexus-auth-storage");
      if (typeof window !== "undefined") {
        // Redirigir mostrando un alert o a una ruta de suspension
        alert("El acceso a la plataforma ha sido suspendido para su empresa.");
        window.location.href = getLoginPath();
      }
    }

    return Promise.reject(error);
  }
);