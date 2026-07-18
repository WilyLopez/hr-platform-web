import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { RegistroAsistencia, ReporteAsistencia, TokenQR, FiltrosAsistencia, RegistrarManualInput, RegistrarMarcajeInput, EstadoAsistenciaHoy } from "@/types/asistencia.types";

export const asistenciaService = {
  async listar(filtros: FiltrosAsistencia = {}): Promise<RegistroAsistencia[]> {
    const r = await apiClient.get<RegistroAsistencia[]>(
      `asistencia/${buildQueryString(filtros)}`
    );
    return r.data;
  },

  async generarReporte(filtros: FiltrosAsistencia): Promise<ReporteAsistencia> {
    const r = await apiClient.get<ReporteAsistencia>(
      `asistencia/reporte/${buildQueryString(filtros)}`
    );
    return r.data;
  },

  async registrarManual(data: RegistrarManualInput): Promise<RegistroAsistencia> {
    const r = await apiClient.post<RegistroAsistencia>("asistencia/manual/", data);
    return r.data;
  },

  async generarQr(sedeId: number, minutosVigencia?: number): Promise<TokenQR> {
    const r = await apiClient.post<TokenQR>(`asistencia/qr/${sedeId}/`, {
      minutos_vigencia: minutosVigencia,
    });
    return r.data;
  },

  async obtenerEstadoHoy(): Promise<EstadoAsistenciaHoy> {
    const r = await apiClient.get<EstadoAsistenciaHoy>("asistencia/estado-hoy/");
    return r.data;
  },

  async registrarMarcaje(data: RegistrarMarcajeInput): Promise<RegistroAsistencia> {
    const r = await apiClient.post<RegistroAsistencia>("asistencia/marcaje/", data);
    return r.data;
  },

  async aprobarExtras(registroId: number, minutosAprobados: number, comentario?: string, aprobar: boolean = true): Promise<{message: string}> {
    const r = await apiClient.post<{message: string}>(`asistencia/${registroId}/extras/`, {
      minutos_aprobados: minutosAprobados,
      comentario: comentario,
      aprobar: aprobar
    });
    return r.data;
  },
};