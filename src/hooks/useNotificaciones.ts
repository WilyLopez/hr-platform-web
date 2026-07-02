"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificacionService } from "@/services/notificacion.service";
import { useNotificacionStore } from "@/store/notificacion.store";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Carga las notificaciones del usuario y sincroniza el contador de no leídas
 * con el store global (usado por el badge del Topbar).
 */
export function useNotificaciones(soloNoLeidas = false) {
  const setNoLeidas = useNotificacionStore((s) => s.setNoLeidas);

  return useQuery({
    queryKey: ["notificaciones", { soloNoLeidas }],
    queryFn:  async () => {
      const data = await notificacionService.listar(soloNoLeidas);
      // Sincronizar el contador global en el store
      setNoLeidas(data.no_leidas);
      return data;
    },
    // Refrescar periódicamente para mantener el badge actualizado
    refetchInterval: 60_000, // cada 60 segundos
    staleTime:       30_000, // considerar fresco por 30 segundos
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Marca una notificación como leída y decrementa el contador del store */
export function useMarcarLeida() {
  const qc          = useQueryClient();
  const decrementar = useNotificacionStore((s) => s.decrementar);
  const toast        = useToast();

  return useMutation({
    mutationFn: (id: number) => notificacionService.marcarLeida(id),
    onSuccess() {
      // Decrementar el badge sin esperar el refetch
      decrementar();
      // Invalidar para sincronizar la lista completa
      qc.invalidateQueries({ queryKey: ["notificaciones"] });
    },
    onError() {
      toast.error("No se pudo marcar la notificación como leída.");
    },
  });
}
