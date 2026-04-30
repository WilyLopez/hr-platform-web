export type NombrePlan = "BASICO" | "PRO";
export type EstadoSuscripcion = "TRIAL" | "ACTIVA" | "VENCIDA" | "SUSPENDIDA";

export interface Plan {
  id: number;
  nombre: NombrePlan;
  precio_mensual: number;
  limite_usuarios: number;
  almacenamiento_gb: number;
  es_activo: boolean;
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