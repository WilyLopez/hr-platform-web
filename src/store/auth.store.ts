import { create } from "zustand";
import type { UsuarioAutenticado, TokenOutput } from "@/types/auth.types";

interface AuthState {
  usuario:     UsuarioAutenticado | null;
  accessToken: string | null;
  setAuth:     (token: TokenOutput) => void;
  clearAuth:   () => void;
  isLoading:   boolean;
  setLoading:  (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario:     null,
  accessToken: null,
  isLoading:   false,

  setAuth(token: TokenOutput) {
    set({
      accessToken: token.access,
      usuario: {
        id:          token.usuario_id,
        codigo_unico: token.codigo_unico,
        empresa_id:  token.empresa_id,
        rol:         token.rol,
      },
    });
  },

  clearAuth() {
    set({ usuario: null, accessToken: null });
  },

  setLoading(v: boolean) {
    set({ isLoading: v });
  },
}));