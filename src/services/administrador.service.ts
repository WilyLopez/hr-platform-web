import { apiClient } from "@/lib/axios";
import type { Administrador, CrearAdministradorInput } from "@/types/administrador.types";

export const administradorService = {
  async listar(empresaId: number): Promise<Administrador[]> {
    const r = await apiClient.get<Administrador[]>(`/empresas/${empresaId}/administradores/`);
    return r.data;
  },

  async crear(empresaId: number, data: CrearAdministradorInput): Promise<Administrador> {
    const r = await apiClient.post<Administrador>(`/empresas/${empresaId}/administradores/`, data);
    return r.data;
  },
};
