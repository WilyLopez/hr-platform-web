import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { RegistroAuditoria, FiltrosAuditoria, ExportarAuditoriaInput } from "@/types/auditoria.types";
import type { PaginatedResponse } from "@/types/api.types";

export const auditoriaService = {
  async listar(filtros: FiltrosAuditoria = {}): Promise<PaginatedResponse<RegistroAuditoria>> {
    const r = await apiClient.get<PaginatedResponse<RegistroAuditoria>>(
      `auditoria/${buildQueryString(filtros)}`
    );
    return r.data;
  },

  async exportar(data: ExportarAuditoriaInput): Promise<Blob> {
    const r = await apiClient.post("auditoria/exportar/", data, {
      responseType: "blob",
    });
    return r.data;
  },
};