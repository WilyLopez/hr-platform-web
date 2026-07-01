"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { asistenciaService } from "@/services/asistencia.service";
import type {
  FiltrosAsistencia,
  RegistrarManualInput,
} from "@/types/asistencia.types";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lista registros de asistencia con filtros opcionales */
export function useAsistencia(filtros: FiltrosAsistencia = {}) {
  return useQuery({
    queryKey: ["asistencia", filtros],
    queryFn:  () => asistenciaService.listar(filtros),
  });
}

/** Reporte de asistencia por empleado/periodo */
export function useReporteAsistencia(filtros: FiltrosAsistencia) {
  return useQuery({
    queryKey: ["asistencia", "reporte", filtros],
    queryFn:  () => asistenciaService.generarReporte(filtros),
    enabled:  !!(filtros.empleado_id || filtros.sede_id),
  });
}

/** Genera un token QR para marcar asistencia en una sede */
export function useQrAsistencia(sedeId: number, minutosVigencia?: number) {
  return useQuery({
    queryKey: ["asistencia", "qr", sedeId, minutosVigencia],
    queryFn:  () => asistenciaService.generarQr(sedeId, minutosVigencia),
    enabled:  !!sedeId,
    // El QR caduca: refrescar automáticamente cerca del vencimiento
    staleTime: 0,
    refetchInterval: minutosVigencia ? (minutosVigencia - 1) * 60 * 1000 : false,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Registra una marcación manual para un empleado */
export function useRegistrarManual() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: RegistrarManualInput) =>
      asistenciaService.registrarManual(data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["asistencia"] });
      toast.success("Asistencia registrada manualmente.");
    },
    onError() {
      toast.error("No se pudo registrar la asistencia.");
    },
  });
}
