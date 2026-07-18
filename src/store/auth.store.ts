import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UsuarioAutenticado, TokenOutput } from "@/types/auth.types";

interface AuthState {
  usuario:        UsuarioAutenticado | null;
  // El accessToken NO se guarda en localStorage via persist.
  // La fuente de verdad es sessionStorage (gestionada por authService).
  // Se mantiene en memoria para el interceptor de Axios y para componentes.
  accessToken:    string | null;
  setAuth:        (token: TokenOutput) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth:      () => void;
  isLoading:      boolean;
  setLoading:     (v: boolean) => void;
  _hasHydrated:   boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario:      null,
      accessToken:  null,
      isLoading:    false,
      _hasHydrated: false,

      setAuth(token: TokenOutput) {
        set({
          accessToken: token.access,
          usuario: {
            id:           token.usuario_id,
            codigo_unico: token.codigo_unico,
            empresa_id:   token.empresa_id,
            rol:          token.rol,
            security:     token.security,
          },
        });
      },

      setAccessToken(token: string | null) {
        set({ accessToken: token });
      },

      clearAuth() {
        set({ usuario: null, accessToken: null });
      },

      setLoading(v: boolean) {
        set({ isLoading: v });
      },

      setHasHydrated(v: boolean) {
        set({ _hasHydrated: v });
      },
    }),
    {
      name: "nexus-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos el usuario (datos de perfil), NO el accessToken.
      // El accessToken vive en sessionStorage via authService y se restaura
      // en el interceptor de Axios al hacer refresh.
      partialize: (state) => ({
        usuario: state.usuario,
      }),
      onRehydrateStorage: () => (state) => {
        // `onRehydrateStorage` devuelve un callback que se ejecuta
        // CUANDO la rehidratación termina. Aquí activamos el flag.
        state?.setHasHydrated(true);
      },
    }
  )
);