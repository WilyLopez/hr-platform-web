import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { Solicitud, CrearSolicitudInput, EvaluarSolicitudInput, FiltrosSolicitud } from "@/types/solicitud.types";
import type { PaginatedResponse } from "@/types/api.types";

export const solicitudService = {
  async listar(filtros: FiltrosSolicitud = {}): Promise<PaginatedResponse<Solicitud>> {
    const r = await apiClient.get<PaginatedResponse<Solicitud>>(
      `/solicitudes/${buildQueryString(filtros)}`
    );
    return r.data;
  },

  async obtener(id: number): Promise<Solicitud> {
    const r = await apiClient.get<Solicitud>(`/solicitudes/${id}/`);
    return r.data;
  },

  async crear(data: CrearSolicitudInput): Promise<Solicitud> {
    const r = await apiClient.post<Solicitud>("/solicitudes/", data);
    return r.data;
  },

  async aprobar(id: number, data: EvaluarSolicitudInput): Promise<Solicitud> {
    const r = await apiClient.post<Solicitud>(`/solicitudes/${id}/aprobar/`, data);
    return r.data;
  },

  async rechazar(id: number, data: EvaluarSolicitudInput): Promise<Solicitud> {
    const r = await apiClient.post<Solicitud>(`/solicitudes/${id}/rechazar/`, data);
    return r.data;
  },

  async cancelar(id: number): Promise<void> {
    await apiClient.post(`/solicitudes/${id}/cancelar/`);
  },

  async uploadAdjunto(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const r = await apiClient.post<{ url: string }>('/solicitudes/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return r.data;
  },
};