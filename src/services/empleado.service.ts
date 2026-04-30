import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { Empleado, RegistrarEmpleadoInput, ActualizarEmpleadoInput, FiltrosEmpleado } from "@/types/empleado.types";
import type { PaginatedResponse } from "@/types/api.types";

export const empleadoService = {
  async listar(filtros: FiltrosEmpleado = {}): Promise<PaginatedResponse<Empleado>> {
    const r = await apiClient.get<PaginatedResponse<Empleado>>(
      `empleados/${buildQueryString(filtros)}`
    );
    return r.data;
  },

  async obtener(id: number): Promise<Empleado> {
    const r = await apiClient.get<Empleado>(`empleados/${id}/`);
    return r.data;
  },

  async registrar(data: RegistrarEmpleadoInput): Promise<Empleado> {
    const r = await apiClient.post<Empleado>("empleados/", data);
    return r.data;
  },

  async actualizar(id: number, data: ActualizarEmpleadoInput): Promise<Empleado> {
    const r = await apiClient.patch<Empleado>(`empleados/${id}/`, data);
    return r.data;
  },

  async desactivar(id: number): Promise<void> {
    await apiClient.post(`empleados/${id}/desactivar/`);
  },

  async reactivar(id: number): Promise<void> {
    await apiClient.post(`empleados/${id}/reactivar/`);
  },

  async asignarSede(id: number, sedeId: number): Promise<void> {
    await apiClient.patch(`empleados/${id}/sede/`, { sede_id: sedeId });
  },
};