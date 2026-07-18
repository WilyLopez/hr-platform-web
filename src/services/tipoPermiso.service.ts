import { apiClient } from "@/lib/axios";
import type { TipoPermiso } from "@/types/solicitud.types";

export const tipoPermisoService = {
  async listar(): Promise<TipoPermiso[]> {
    const r = await apiClient.get<TipoPermiso[]>("/solicitudes/tipos-permiso/");
    return r.data;
  },
};
