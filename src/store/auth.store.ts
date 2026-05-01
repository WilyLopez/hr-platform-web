import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UsuarioAutenticado, TokenOutput } from "@/types/auth.types";

interface AuthState {
  usuario:      UsuarioAutenticado | null;
  accessToken:  string | null;
  setAuth:      (token: TokenOutput) => void;
  clearAuth:    () => void;
  isLoading:    boolean;
  setLoading:   (v: boolean) => void;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario:     null,
      accessToken: null,
      isLoading:   false,
      _hasHydrated: false, // We'll keep this but ensure it's set correctly

      setAuth(token: TokenOutput) {
        set({
          accessToken: token.access,
          usuario: {
            id:           token.usuario_id,
            codigo_unico: token.codigo_unico,
            empresa_id:   token.empresa_id,
            rol:          token.rol,
          },
        });
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
      partialize: (state) => ({
        usuario:     state.usuario,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        // This is called when rehydration starts. 
        // We return a function that will be called when rehydration finishes.
        return () => state?.setHasHydrated(true);
      },
    }
  )
);