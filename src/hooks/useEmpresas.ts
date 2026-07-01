"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empresaService } from "@/services/empresa.service";
import type {
  ActualizarEmpresaInput,
  CrearSedeInput,
} from "@/types/empresa.types";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lista todas las empresas con paginación y filtro por estado (superadmin) */
export function useEmpresas(params: { estado?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ["empresas", params],
    queryFn:  () => empresaService.listar(params),
  });
}

/** Obtiene el detalle completo de una empresa por ID */
export function useEmpresa(id: number) {
  return useQuery({
    queryKey: ["empresas", id],
    queryFn:  () => empresaService.obtener(id),
    enabled:  !!id,
  });
}

/** Lista las sedes de una empresa */
export function useSedes(empresaId: number) {
  return useQuery({
    queryKey: ["empresas", empresaId, "sedes"],
    queryFn:  () => empresaService.listarSedes(empresaId),
    enabled:  !!empresaId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Actualiza los datos editables de una empresa */
export function useActualizarEmpresa(id: number) {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: ActualizarEmpresaInput) =>
      empresaService.actualizar(id, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empresas", id] });
      qc.invalidateQueries({ queryKey: ["empresas"] });
      toast.success("Empresa actualizada correctamente.");
    },
    onError() {
      toast.error("No se pudo actualizar la empresa.");
    },
  });
}

/** Suspende una empresa con una razón (superadmin) */
export function useSuspenderEmpresa() {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, razon }: { id: number; razon: string }) =>
      empresaService.suspender(id, razon),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empresas"] });
      toast.success("Empresa suspendida.");
    },
    onError() {
      toast.error("No se pudo suspender la empresa.");
    },
  });
}

/** Crea una nueva sede para una empresa */
export function useCrearSede(empresaId: number) {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CrearSedeInput) =>
      empresaService.crearSede(empresaId, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empresas", empresaId, "sedes"] });
      toast.success("Sede creada exitosamente.");
    },
    onError() {
      toast.error("No se pudo crear la sede.");
    },
  });
}

/** Actualiza una sede existente */
export function useActualizarSede(empresaId: number, sedeId: number) {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CrearSedeInput) =>
      empresaService.actualizarSede(empresaId, sedeId, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empresas", empresaId, "sedes"] });
      toast.success("Sede actualizada correctamente.");
    },
    onError() {
      toast.error("No se pudo actualizar la sede.");
    },
  });
}
