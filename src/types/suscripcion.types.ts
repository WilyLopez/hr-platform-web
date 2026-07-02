export type NombrePlan = "BASICO" | "PRO";
export type EstadoSuscripcion = "TRIAL" | "ACTIVA" | "VENCIDA" | "SUSPENDIDA";

export interface Plan {
  id: number;
  nombre: string;
  precio_mensual: number;
  limite_usuarios: number;
  almacenamiento_gb: number;
  color?: string;
  descripcion_corta?: string;
  orden?: number;
  es_activo: boolean;
  empresas_count?: number;
}

export interface Suscripcion {
  id: number;
  empresa_id: number;
  plan_id: number;
  plan_nombre: NombrePlan;
  estado: EstadoSuscripcion;
  fecha_inicio: string;
  fecha_fin_trial: string | null;
  fecha_proxima_facturacion: string | null;
  usuarios_activos: number;
  limite_usuarios: number;
  dias_restantes_trial: number | null;
}

export interface SuscripcionSuperadmin {
  id: number;
  empresa_id: number;
  empresa_nombre: string;
  plan_id: number;
  plan_nombre: string;
  estado: EstadoSuscripcion;
  fecha_inicio: string;
  fecha_fin_trial: string | null;
  fecha_proxima_facturacion: string | null;
  usuarios_activos: number;
  limite_usuarios: number;
  fecha_creacion: string;
}