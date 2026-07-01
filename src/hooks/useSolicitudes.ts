"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitudService } from "@/services/solicitud.service";
import type {
  FiltrosSolicitud,
  CrearSolicitudInput,
  EvaluarSolicitudInput,
} from "@/types/solicitud.types";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lista solicitudes con filtros opcionales (estado, empleado, fechas, etc.) */
export function useSolicitudes(filtros: FiltrosSolicitud = {}) {
  return useQuery({
    queryKey: ["solicitudes", filtros],
    queryFn:  () => solicitudService.listar(filtros),
  });
}

/** Obtiene el detalle de una solicitud específica */
export function useSolicitud(id: number) {
  return useQuery({
    queryKey: ["solicitudes", id],
    queryFn:  () => solicitudService.obtener(id),
    enabled:  !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Crea una nueva solicitud de permiso o vacaciones */
export function useCrearSolicitud() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CrearSolicitudInput) => solicitudService.crear(data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      toast.success("Solicitud enviada exitosamente.");
    },
    onError() {
      toast.error("No se pudo enviar la solicitud.");
    },
  });
}

/** Aprueba una solicitud pendiente */
export function useAprobarSolicitud() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EvaluarSolicitudInput }) =>
      solicitudService.aprobar(id, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      toast.success("Solicitud aprobada.");
    },
    onError() {
      toast.error("No se pudo aprobar la solicitud.");
    },
  });
}

/** Rechaza una solicitud */
export function useRechazarSolicitud() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EvaluarSolicitudInput }) =>
      solicitudService.rechazar(id, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      toast.success("Solicitud rechazada.");
    },
    onError() {
      toast.error("No se pudo rechazar la solicitud.");
    },
  });
}

/** Cancela una solicitud propia (empleado) */
export function useCancelarSolicitud() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => solicitudService.cancelar(id),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
      toast.success("Solicitud cancelada.");
    },
    onError() {
      toast.error("No se pudo cancelar la solicitud.");
    },
  });
}
