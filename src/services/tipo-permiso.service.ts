import { apiClient } from "@/lib/axios";
import type { TipoPermiso, CrearTipoPermisoInput } from "@/types/solicitud.types";

export const tipoPermisoService = {
  async listar(): Promise<TipoPermiso[]> {
    const r = await apiClient.get<TipoPermiso[]>("/solicitudes/tipos-permiso/");
    return r.data;
  },

  async crear(data: CrearTipoPermisoInput): Promise<TipoPermiso> {
    const r = await apiClient.post<TipoPermiso>("/solicitudes/tipos-permiso/", data);
    return r.data;
  },

  async actualizar(id: number, data: CrearTipoPermisoInput): Promise<TipoPermiso> {
    const r = await apiClient.patch<TipoPermiso>(`/solicitudes/tipos-permiso/${id}/`, data);
    return r.data;
  },
};