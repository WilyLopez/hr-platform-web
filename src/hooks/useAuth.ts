"use client";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { ROLES_DASHBOARD_PATH } from "@/utils/constants";
import type { LoginInput } from "@/types/auth.types";

export function useAuth() {
  const { usuario, accessToken, setAuth, clearAuth, isLoading, setLoading } =
    useAuthStore();
  const router = useRouter();

  async function login(data: LoginInput, redirectTo?: string) {
    setLoading(true);
    try {
      const token = await authService.login(data);
      setAuth(token);
      const dest = redirectTo ?? ROLES_DASHBOARD_PATH[token.rol] ?? "/";
      router.push(dest);
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