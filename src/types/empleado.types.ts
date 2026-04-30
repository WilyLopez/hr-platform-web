export type EstadoEmpleado = "ACTIVO" | "INACTIVO";
export type TipoDocumento = "DNI" | "CE" | "PASAPORTE" | "RUC";

export interface Empleado {
  id: number;
  empresa_id: number;
  codigo_unico: string;
  nombres: string;
  apellidos: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  correo: string;
  cargo: string;
  area: string;
  sede_id: number;
  sede_nombre: string | null;
  estado: EstadoEmpleado;
  fecha_ingreso: string;
  fecha_creacion: string;
}

export interface RegistrarEmpleadoInput {
  nombres: string;
  apellidos: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  correo: string;
  cargo: string;
  area: string;
  sede_id: number;
  fecha_ingreso: string;
}

export interface ActualizarEmpleadoInput {
  nombres: string;
  apellidos: string;
  correo: string;
  cargo: string;
  area: string;
}

export interface FiltrosEmpleado {
  estado?: EstadoEmpleado;
  area?: string;
  sede_id?: number;
  search?: string;
  page?: number;
  page_size?: number;
}