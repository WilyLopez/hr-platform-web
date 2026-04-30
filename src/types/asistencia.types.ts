export type TipoMarcaje = "ENTRADA" | "SALIDA";
export type MetodoMarcaje = "QR" | "MANUAL";

export interface RegistroAsistencia {
  id: number;
  empleado_id: number;
  empleado_nombre: string;
  sede_id: number;
  sede_nombre: string | null;
  tipo: TipoMarcaje;
  metodo: MetodoMarcaje;
  es_tardanza: boolean;
  es_manual: boolean;
  timestamp: string;
}

export interface ReporteAsistencia {
  empleado_id: number;
  empleado_nombre: string;
  total_dias: number;
  dias_presentes: number;
  dias_ausentes: number;
  tardanzas: number;
  registros: RegistroAsistencia[];
}

export interface TokenQR {
  token: string;
  sede_id: number;
  sede_nombre: string;
  expira_en: string;
  imagen_base64: string;
}

export interface FiltrosAsistencia {
  empleado_id?: number;
  sede_id?: number;
  area?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  page_size?: number;
}

export interface RegistrarManualInput {
  empleado_id: number;
  tipo: TipoMarcaje;
  fecha: string;
  hora: string;
  justificacion: string;
}