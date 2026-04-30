"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadoService } from "@/services/empleado.service";
import type { FiltrosEmpleado, RegistrarEmpleadoInput, ActualizarEmpleadoInput } from "@/types/empleado.types";
import { useToast } from "./useToast";

export function useEmpleados(filtros: FiltrosEmpleado = {}) {
  return useQuery({
    queryKey: ["empleados", filtros],
    queryFn:  () => empleadoService.listar(filtros),
  });
}

export function useEmpleado(id: number) {
  return useQuery({
    queryKey: ["empleados", id],
    queryFn:  () => empleadoService.obtener(id),
    enabled:  !!id,
  });
}

export function useRegistrarEmpleado() {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: RegistrarEmpleadoInput) => empleadoService.registrar(data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado registrado exitosamente.");
    },
    onError() {
      toast.error("No se pudo registrar el empleado.");
    },
  });
}

export function useActualizarEmpleado(id: number) {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: ActualizarEmpleadoInput) => empleadoService.actualizar(id, data),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado actualizado correctamente.");
    },
    onError() {
      toast.error("No se pudo actualizar el empleado.");
    },
  });
}

export function useDesactivarEmpleado() {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: number) => empleadoService.desactivar(id),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["empleados"] });
      toast.success("Empleado desactivado.");
    },
    onError() {
      toast.error("No se pudo desactivar el empleado.");
    },
  });
}