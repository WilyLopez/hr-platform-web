export type TipoMarcaje = "ENTRADA" | "SALIDA" | "INICIO_REFRIGERIO" | "FIN_REFRIGERIO";
export type OrigenMarcaje = "QR" | "MANUAL" | "WEB" | "MOVIL" | "API";
export type EstadoAuditoriaMarcaje = "VALIDO" | "CORREGIDO" | "RECHAZADO" | "PENDIENTE_APROBACION";
export type ResultadoMarcaje = "NORMAL" | "TARDE" | "TEMPRANO" | "FUERA_HORARIO" | "EXTRA";

export interface RegistroAsistencia {
  id: number;
  empleado_id: number;
  empleado_nombre: string;
  sede_id: number;
  sede_nombre: string | null;
  tipo: TipoMarcaje;
  origen: OrigenMarcaje;
  estado_auditoria: EstadoAuditoriaMarcaje;
  resultado: ResultadoMarcaje;
  minutos_tardanza: number;
  minutos_extra: number;
  minutos_temprano: number;
  horas_trabajadas: number;
  estado_extras: string | null;
  minutos_extra_aprobados: number | null;
  timestamp: string;
}

export interface EstadoAsistenciaHoy {
  estado_actual: "SIN_MARCAR" | "TRABAJANDO" | "EN_REFRIGERIO" | "FINALIZADO" | "DE_PERMISO" | "VACACIONES" | "DESCANSO" | "FALTA";
  horario_hoy: string;
  ultimo_marcaje: string | null;
  tiempo_trabajado_str: string;
  tiempo_trabajado_minutos: number;
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
  solo_extras?: boolean;
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

export interface RegistrarMarcajeInput {
  origen: OrigenMarcaje;
  token_qr?: string;
  latitud?: number;
  longitud?: number;
}