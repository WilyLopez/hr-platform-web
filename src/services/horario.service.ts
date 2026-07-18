import { apiClient } from "@/lib/axios";
import type { 
  Horario, 
  HorarioCreateInput, 
  HorarioUpdateInput, 
  AsignacionHorario, 
  AsignacionHorarioInput 
} from "@/types/horario.types";

export const horarioService = {
  async listar(includeInactive = false): Promise<Horario[]> {
    const r = await apiClient.get<Horario[]>("/horarios/horarios/", {
      params: { include_inactive: includeInactive }
    });
    return r.data;
  },

  async obtener(id: number): Promise<Horario> {
    const r = await apiClient.get<Horario>(`/horarios/horarios/${id}/`);
    return r.data;
  },

  async crear(data: HorarioCreateInput): Promise<Horario> {
    const r = await apiClient.post<Horario>("/horarios/horarios/", data);
    return r.data;
  },

  async actualizar(id: number, data: HorarioUpdateInput): Promise<Horario> {
    const r = await apiClient.put<Horario>(`/horarios/horarios/${id}/`, data);
    return r.data;
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/horarios/horarios/${id}/`);
  },

  async asignar(data: AsignacionHorarioInput): Promise<AsignacionHorario> {
    const r = await apiClient.post<AsignacionHorario>("/horarios/asignaciones/", data);
    return r.data;
  },

  async listarAsignacionesEmpleado(empleadoId: number): Promise<AsignacionHorario[]> {
    const r = await apiClient.get<AsignacionHorario[]>(`/horarios/empleados/${empleadoId}/asignaciones/`);
    return r.data;
  }
};
