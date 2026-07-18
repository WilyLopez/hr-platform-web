"use client";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { ROLES_DASHBOARD_PATH } from "@/utils/constants";
import type { LoginInput } from "@/types/auth.types";

import { useToast } from "./useToast";

export function useAuth() {
  const { usuario, accessToken, setAuth, clearAuth, isLoading, setLoading } =
    useAuthStore();
  const router = useRouter();
  const toast = useToast();

  async function login(data: LoginInput, redirectTo?: string) {
    setLoading(true);
    try {
      const token = await authService.login(data);
      setAuth(token);
      let dest = redirectTo ?? ROLES_DASHBOARD_PATH[token.rol] ?? "/";
      
      // Forzar cambio de contraseña si el flag está activo
      if (token.security?.must_change_password) {
        dest = `/cambiar-contrasena`;
      }
      
      router.push(dest);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error al intentar iniciar sesión. Revisa tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const refresh = authService.getRefreshToken();
    if (refresh) {
      try { await authService.logout(refresh); } catch { /* silent */ }
    }
    clearAuth();
    authService.clearSession();
    router.push("/");
  }

  return {
    usuario,
    accessToken,
    isLoading,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };
}