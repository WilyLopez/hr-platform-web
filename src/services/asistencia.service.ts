import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { RegistroAsistencia, ReporteAsistencia, TokenQR, FiltrosAsistencia, RegistrarManualInput } from "@/types/asistencia.types";

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
};