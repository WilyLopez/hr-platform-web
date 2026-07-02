"use client";
import { useQuery } from "@tanstack/react-query";
import { auditoriaService } from "@/services/auditoria.service";
import type { FiltrosAuditoria, ExportarAuditoriaInput } from "@/types/auditoria.types";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista el log de auditoría con filtros opcionales (empresa, usuario, tipo
 * de evento, fechas, página). Devuelve respuesta paginada.
 */
export function useAuditoria(filtros: FiltrosAuditoria = {}) {
  return useQuery({
    queryKey: ["auditoria", filtros],
    queryFn:  () => auditoriaService.listar(filtros),
    // La auditoría es consulta de solo lectura; no necesita staleTime corto.
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Acciones ─────────────────────────────────────────────────────────────────

/**
 * Descarga el log de auditoría como PDF o CSV.
 * Se usa como función directa (no mutation de RQ) porque dispara un blob download.
 */
export function useExportarAuditoria() {
  const toast = useToast();

  async function exportar(data: ExportarAuditoriaInput) {
    try {
      const blob = await auditoriaService.exportar(data);
      const ext  = data.formato === "PDF" ? "pdf" : "csv";
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `auditoria_${data.fecha_desde}_${data.fecha_hasta}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Reporte de auditoría exportado como ${data.formato}.`);
    } catch {
      toast.error("No se pudo exportar el reporte de auditoría.");
    }
  }

  return { exportar };
}
