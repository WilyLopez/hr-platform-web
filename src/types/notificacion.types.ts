export type CanalNotificacion = "EMAIL" | "IN_APP" | "PUSH";

export interface Notificacion {
  id: number;
  usuario_id: number;
  titulo: string;
  mensaje: string;
  canal: CanalNotificacion;
  leida: boolean;
  enviada: boolean;
  fecha_envio: string | null;
  fecha_creacion: string;
}

export interface NotificacionesResponse {
  no_leidas: number;
  results: Notificacion[];
}