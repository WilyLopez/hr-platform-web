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
};