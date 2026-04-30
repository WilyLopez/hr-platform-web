import { apiClient } from "@/lib/axios";
import type { NotificacionesResponse } from "@/types/notificacion.types";

export const notificacionService = {
  async listar(soloNoLeidas = false): Promise<NotificacionesResponse> {
    const params = soloNoLeidas ? "?no_leidas=true" : "";
    const r = await apiClient.get<NotificacionesResponse>(`/notificaciones/${params}`);
    return r.data;
  },

  async marcarLeida(id: number): Promise<void> {
    await apiClient.post(`/notificaciones/${id}/leer/`);
  },
};