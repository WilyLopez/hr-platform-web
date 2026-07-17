import type { Rol } from "@/types/auth.types";
import type { EstadoEmpresa } from "@/types/empresa.types";
import type { EstadoEmpleado } from "@/types/empleado.types";
import type { EstadoSolicitud } from "@/types/solicitud.types";
import type { EstadoSuscripcion } from "@/types/suscripcion.types";

export const APP_NAME = "NexusRH";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";

export const ROLES: Record<Rol, string> = {
    SUPERADMIN: "Super Administrador",
    PROPIETARIO: "Propietario",
    ADMIN: "Administrador RRHH",
    EMPLEADO: "Empleado",
};

export const ROLES_LOGIN_PATH: Record<Rol, string> = {
    SUPERADMIN: "/superadmin/login",
    PROPIETARIO: "/propietario/login",
    ADMIN: "/admin/login",
    EMPLEADO: "/empleado/login",
};

export const ROLES_DASHBOARD_PATH: Record<Rol, string> = {
    SUPERADMIN: "/superadmin/dashboard",
    PROPIETARIO: "/propietario/dashboard",
    ADMIN: "/admin/dashboard",
    EMPLEADO: "/empleado/dashboard",
};

export const ESTADOS_EMPRESA: Record<
    EstadoEmpresa,
    { label: string; variant: string }
> = {
    ACTIVA: { label: "Activa", variant: "success" },
    EN_PRUEBA: { label: "En prueba", variant: "warning" },
    SUSPENDIDA: { label: "Suspendida", variant: "danger" },
    ELIMINADA: { label: "Eliminada", variant: "neutral" },
};

export const ESTADOS_EMPLEADO: Record<
    EstadoEmpleado,
    { label: string; variant: string }
> = {
    ACTIVO: { label: "Activo", variant: "success" },
    INACTIVO: { label: "Inactivo", variant: "neutral" },
};

export const ESTADOS_USUARIO: Record<string, string> = {
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    BLOQUEADO: "Bloqueado",
};

export const ESTADOS_SOLICITUD: Record<
    EstadoSolicitud,
    { label: string; variant: string }
> = {
    PENDIENTE: { label: "Pendiente", variant: "warning" },
    EN_REVISION: { label: "En revisión", variant: "brand" },
    APROBADA: { label: "Aprobada", variant: "success" },
    RECHAZADA: { label: "Rechazada", variant: "danger" },
    CANCELADA: { label: "Cancelada", variant: "neutral" },
};

export const ESTADOS_SUSCRIPCION: Record<
    EstadoSuscripcion,
    { label: string; variant: string }
> = {
    TRIAL: { label: "Periodo de prueba", variant: "warning" },
    ACTIVA: { label: "Activa", variant: "success" },
    VENCIDA: { label: "Vencida", variant: "danger" },
    SUSPENDIDA: { label: "Suspendida", variant: "neutral" },
};

export const TIPOS_DOCUMENTO = [
    { value: "DNI", label: "DNI" },
    { value: "CE", label: "Carné de Extranjería" },
    { value: "PASAPORTE", label: "Pasaporte" },
    { value: "RUC", label: "RUC" },
] as const;

export const TIPOS_MARCAJE = [
    { value: "ENTRADA", label: "Entrada" },
    { value: "SALIDA", label: "Salida" },
] as const;

export const PAGE_SIZE_DEFAULT = 20;
export const TRIAL_ALERT_DAYS = 7;
