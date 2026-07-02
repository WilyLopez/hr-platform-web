export type Rol = "SUPERADMIN" | "PROPIETARIO" | "ADMIN" | "EMPLEADO";

export interface TokenOutput {
  access: string;
  refresh: string;
  usuario_id: number;
  codigo_unico: string;
  empresa_id: number | null;
  rol: Rol;
}

export interface UsuarioAutenticado {
  id: number;
  codigo_unico: string;
  empresa_id: number | null;
  rol: Rol;
  correo?: string;
}

export interface LoginInput {
  codigo_unico: string;
  contrasena: string;
}

export interface RecuperarContrasenaInput {
  correo: string;
}

export interface PerfilOutput {
  id: number;
  empresa_id: number | null;
  codigo_unico: string;
  correo: string;
  rol: Rol;
  estado: string;
  ultimo_acceso: string | null;
  fecha_creacion: string;
}

export interface CambiarContrasenaInput {
  contrasena_actual: string;
  contrasena_nueva: string;
}