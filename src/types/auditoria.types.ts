export interface RegistroAuditoria {
  id: number;
  empresa_id: number | null;
  usuario_id: number | null;
  rol_usuario: string | null;
  tipo_evento: string;
  descripcion: string;
  ip_address: string | null;
  detalles: Record<string, unknown>;
  timestamp: string;
}

export interface FiltrosAuditoria {
  empresa_id?: number;
  usuario_id?: number;
  rol?: string;
  tipo_evento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
}

export interface ExportarAuditoriaInput {
  fecha_desde: string;
  fecha_hasta: string;
  formato: "PDF" | "CSV";
}