"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { administradorService } from "@/services/administrador.service";
import type { CrearAdministradorInput } from "@/types/administrador.types";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "./useToast";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Lista los administradores de la empresa del propietario autenticado.
 * El empresaId se lee del store para no requerir prop.
 */
export function useAdministradores() {
  const empresaId = useAuthStore((s) => s.usuario?.empresa_id);

  return useQuery({
    queryKey: ["administradores", empresaId],
    queryFn:  () => administradorService.listar(empresaId!),
    enabled:  !!empresaId,
  });
}

/** Lista los administradores de una empresa específica (uso superadmin) */
export function useAdministradoresByEmpresa(empresaId: number) {
  return useQuery({
    queryKey: ["administradores", empresaId],
    queryFn:  () => administradorService.listar(empresaId),
    enabled:  !!empresaId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Crea un nuevo administrador para la empresa del propietario autenticado */
export function useCrearAdministrador() {
  const qc        = useQueryClient();
  const toast     = useToast();
  const empresaId = useAuthStore((s) => s.usuario?.empresa_id);

  return useMutation({
    mutationFn: (data: CrearAdministradorInput) =>
      administradorService.crear(empresaId!, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["administradores", empresaId] });
      toast.success("Administrador creado. Las credenciales fueron enviadas por correo.");
    },
    onError() {
      toast.error("No se pudo crear el administrador. Verifica que el correo no esté registrado.");
    },
  });
}
