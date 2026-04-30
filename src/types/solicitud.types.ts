export type EstadoSolicitud =
  | "PENDIENTE"
  | "EN_REVISION"
  | "APROBADA"
  | "RECHAZADA"
  | "CANCELADA";

export interface TipoPermiso {
  id: number;
  empresa_id: number;
  nombre: string;
  descripcion: string;
  requiere_adjunto: boolean;
  es_activo: boolean;
}

export interface Solicitud {
  id: number;
  empresa_id: number;
  empleado_id: number;
  empleado_nombre: string;
  tipo_permiso_id: number;
  tipo_permiso_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_solicitados: number;
  motivo: string;
  estado: EstadoSolicitud;
  adjunto_url: string | null;
  comentario_evaluador: string | null;
  evaluado_por_id: number | null;
  fecha_evaluacion: string | null;
  fecha_creacion: string;
}

export interface CrearSolicitudInput {
  tipo_permiso_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
  adjunto_url?: string | null;
}

export interface EvaluarSolicitudInput {
  comentario?: string | null;
}

export interface FiltrosSolicitud {
  estado?: EstadoSolicitud;
  empleado_id?: number;
  tipo_permiso_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
}

export interface CrearTipoPermisoInput {
  nombre: string;
  descripcion: string;
  requiere_adjunto: boolean;
}