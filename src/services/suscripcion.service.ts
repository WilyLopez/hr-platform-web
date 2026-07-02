import { apiClient } from "@/lib/axios";
import type { Plan, Suscripcion } from "@/types/suscripcion.types";

export const suscripcionService = {
  async listarPlanes(): Promise<Plan[]> {
    const r = await apiClient.get<Plan[]>("/suscripciones/planes/");
    return r.data;
  },

  async obtenerSuscripcion(): Promise<Suscripcion> {
    const r = await apiClient.get<Suscripcion>("/suscripciones/mi-suscripcion/");
    return r.data;
  },

  async cambiarPlan(nuevoPlanId: number): Promise<Suscripcion> {
    const r = await apiClient.post<Suscripcion>(
      "/suscripciones/mi-suscripcion/cambiar-plan/",
      { nuevo_plan_id: nuevoPlanId }
    );
    return r.data;
  },

  async cambiarPlanSuperadmin(empresaId: number, nuevoPlanId: number): Promise<Suscripcion> {
    const r = await apiClient.post<Suscripcion>(
      `/suscripciones/superadmin/empresas/${empresaId}/cambiar-plan/`,
      { nuevo_plan_id: nuevoPlanId }
    );
    return r.data;
  },

  async crearPlan(data: Partial<Plan>): Promise<Plan> {
    const r = await apiClient.post<Plan>("/suscripciones/planes/", data);
    return r.data;
  },

  async actualizarPlan(id: number, data: Partial<Plan>): Promise<Plan> {
    const r = await apiClient.put<Plan>(`/suscripciones/planes/${id}/`, data);
    return r.data;
  },

  async listarSuscripcionesSuperadmin(estado?: string): Promise<SuscripcionSuperadmin[]> {
    const params = estado ? { estado } : {};
    const r = await apiClient.get<SuscripcionSuperadmin[]>("/suscripciones/superadmin/suscripciones/", { params });
    return r.data;
  },
};