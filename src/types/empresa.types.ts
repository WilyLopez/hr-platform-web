export type EstadoEmpresa = "ACTIVA" | "SUSPENDIDA" | "EN_PRUEBA" | "ELIMINADA";

export interface Empresa {
  id: number;
  ruc: string;
  razon_social: string;
  nombre_comercial: string;
  correo: string;
  telefono: string;
  direccion: string;
  logo_url: string | null;
  estado: EstadoEmpresa;
  fecha_registro: string;
}

export interface EmpresaListItem {
  id: number;
  ruc: string;
  razon_social: string;
  estado: EstadoEmpresa;
  plan_nombre: string | null;
  fecha_registro: string;
}

export interface RegistrarEmpresaInput {
  ruc: string;
  correo: string;
  telefono: string;
  direccion: string;
  contrasena: string;
  plan_id: number;
}

export interface ActualizarEmpresaInput {
  nombre_comercial: string;
  telefono: string;
  direccion: string;
  logo_url?: string | null;
}

export interface ValidarRucResponse {
  status: string;
  data: {
    ruc: string;
    razon_social: string;
    nombre_comercial: string;
    direccion: string;
    estado: string;
  };
}

export type EstadoSede = "activa" | "inactiva";

export interface Sede {
  id: number;
  empresa_id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  radio_metros: number;
  es_activa: boolean;
}

export interface CrearSedeInput {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  radio_metros: number;
}