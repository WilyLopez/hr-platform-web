export type EstadoUsuario = "ACTIVO" | "INACTIVO" | "BLOQUEADO";

export interface Administrador {
  id: number;
  empresa_id: number | null;
  codigo_unico: string;
  correo: string;
  rol: string;
  estado: EstadoUsuario;
  ultimo_acceso: string | null;
  fecha_creacion: string;
}

export interface CrearAdministradorInput {
  correo: string;
  contrasena: string;
}
