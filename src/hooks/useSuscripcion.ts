"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suscripcionService } from "@/services/suscripcion.service";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la suscripción activa de la empresa del usuario autenticado.
 * Incluye estado, plan, días de trial restantes y límite de usuarios.
 */
export function useSuscripcion() {
  return useQuery({
    queryKey: ["suscripcion"],
    queryFn:  () => suscripcionService.obtenerSuscripcion(),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Cambia el plan de suscripción de la empresa */
export function useCambiarPlan() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (nuevoPlanId: number) =>
      suscripcionService.cambiarPlan(nuevoPlanId),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["suscripcion"] });
      toast.success("Plan actualizado correctamente.");
    },
    onError() {
      toast.error("No se pudo cambiar el plan. Intenta nuevamente.");
    },
  });
}
