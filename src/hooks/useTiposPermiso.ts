"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tipoPermisoService } from "@/services/tipo-permiso.service";
import type { CrearTipoPermisoInput } from "@/types/solicitud.types";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista los tipos de permiso configurados para la empresa.
 * Usados en formularios de solicitudes y en la pantalla de configuración.
 */
export function useTiposPermiso() {
  return useQuery({
    queryKey: ["tipos-permiso"],
    queryFn:  () => tipoPermisoService.listar(),
    // Los tipos de permiso cambian raramente; mantenerlos en caché 10 min.
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Crea un nuevo tipo de permiso (ej: "Permiso médico", "Vacaciones") */
export function useCrearTipoPermiso() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CrearTipoPermisoInput) =>
      tipoPermisoService.crear(data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["tipos-permiso"] });
      toast.success("Tipo de permiso creado correctamente.");
    },
    onError() {
      toast.error("No se pudo crear el tipo de permiso.");
    },
  });
}

/** Actualiza un tipo de permiso existente */
export function useActualizarTipoPermiso(id: number) {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CrearTipoPermisoInput) =>
      tipoPermisoService.actualizar(id, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["tipos-permiso"] });
      toast.success("Tipo de permiso actualizado.");
    },
    onError() {
      toast.error("No se pudo actualizar el tipo de permiso.");
    },
  });
}
