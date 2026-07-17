import { apiClient } from "@/lib/axios";
import type { LoginInput, TokenOutput } from "@/types/auth.types";
import Cookies from "js-cookie";

export const authService = {
  async login(data: LoginInput): Promise<TokenOutput> {
    const response = await apiClient.post<TokenOutput>("auth/login/", {
      codigo_unico: data.codigo_unico,
      contrasena:   data.contrasena,
    });
    const token = response.data;
    sessionStorage.setItem("access_token", token.access);
    Cookies.set("refresh_token", token.refresh, { expires: 7, sameSite: "strict" });
    Cookies.set("user_rol", token.rol, { expires: 7, sameSite: "strict" });
    return token;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("auth/logout/", { refresh: refreshToken });
    sessionStorage.removeItem("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_rol");
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await apiClient.post<{ access: string }>(
      "auth/token/refresh/",
      { refresh }
    );
    return response.data;
  },

  async recuperarContrasena(correo: string): Promise<void> {
    await apiClient.post("auth/recuperar-contrasena/", { correo });
  },

  async obtenerPerfil(): Promise<import("@/types/auth.types").PerfilOutput> {
    const response = await apiClient.get("auth/perfil/");
    return response.data;
  },

  async cambiarContrasena(data: import("@/types/auth.types").CambiarContrasenaInput): Promise<void> {
    await apiClient.put("auth/perfil/cambiar-contrasena/", data);
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("access_token");
  },

  getRefreshToken(): string | undefined {
    return Cookies.get("refresh_token");
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  clearSession(): void {
    sessionStorage.removeItem("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_rol");
  },
};