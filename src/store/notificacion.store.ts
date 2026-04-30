import { create } from "zustand";

interface NotificacionState {
  noLeidas:    number;
  setNoLeidas: (n: number) => void;
  decrementar: () => void;
}

export const useNotificacionStore = create<NotificacionState>((set) => ({
  noLeidas: 0,
  setNoLeidas: (n) => set({ noLeidas: n }),
  decrementar: () => set((s) => ({ noLeidas: Math.max(0, s.noLeidas - 1) })),
}));