"use client";
import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id:       string;
  message:  string;
  variant:  ToastVariant;
  duration: number;
}

interface ToastStore {
  toasts:  Toast[];
  add:     (message: string, variant?: ToastVariant, duration?: number) => void;
  remove:  (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add(message, variant = "info", duration = 4000) {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, variant, duration }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  remove(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export function useToast() {
  const { add } = useToastStore();
  return {
    success: (msg: string) => add(msg, "success"),
    error:   (msg: string) => add(msg, "error"),
    warning: (msg: string) => add(msg, "warning"),
    info:    (msg: string) => add(msg, "info"),
  };
}