import { apiClient } from "@/lib/axios";
import { buildQueryString } from "./api";
import type { Empresa, EmpresaListItem, RegistrarEmpresaInput, ActualizarEmpresaInput, ValidarRucResponse, Sede, CrearSedeInput } from "@/types/empresa.types";
import type { PaginatedResponse } from "@/types/api.types";

export const empresaService = {
  async validarRuc(ruc: string): Promise<ValidarRucResponse> {
    const r = await apiClient.get<ValidarRucResponse>(`/empresas/validar-ruc/${ruc}/`);
    return r.data;
  },

  async registrar(data: RegistrarEmpresaInput): Promise<Empresa> {
    const r = await apiClient.post<Empresa>("/empresas/registro/", data);
    return r.data;
  },

  async listar(params: { estado?: string; page?: number } = {}): Promise<PaginatedResponse<EmpresaListItem>> {
    const r = await apiClient.get<PaginatedResponse<EmpresaListItem>>(
      `/empresas/${buildQueryString(params)}`
    );
    return r.data;
  },

  async obtenerDashboardSuperadmin(): Promise<{
    total_empresas: number;
    total_usuarios: number;
    pruebas_activas: number;
    mrr_estimado: number;
  }> {
    const r = await apiClient.get("/empresas/dashboard-superadmin/");
    return r.data;
  },

  async obtener(id: number): Promise<Empresa> {
    const r = await apiClient.get<Empresa>(`/empresas/${id}/`);
    return r.data;
  },

  async obtenerMetricas(id: number): Promise<{
    empleados: number;
    usuarios: number;
    marcajes_hoy: number;
    solicitudes_mes: number;
    espacio_gb: number;
    limite_usuarios: number;
    limite_espacio: number;
  }> {
    const r = await apiClient.get(`/empresas/${id}/metricas/`);
    return r.data;
  },

  async actualizar(id: number, data: ActualizarEmpresaInput): Promise<Empresa> {
    const r = await apiClient.patch<Empresa>(`/empresas/${id}/`, data);
    return r.data;
  },

  async suspender(id: number, motivo_categoria: string, comentario: string, propietario_email?: string): Promise<void> {
    await apiClient.post(`/empresas/${id}/suspender/`, { motivo_categoria, comentario, propietario_email });
  },

  async reactivar(id: number, motivo_categoria: string, comentario: string): Promise<void> {
    await apiClient.post(`/empresas/${id}/reactivar/`, { motivo_categoria, comentario });
  },

  async listarSedes(empresaId: number): Promise<Sede[]> {
    const r = await apiClient.get<Sede[]>(`/empresas/${empresaId}/sedes/`);
    return r.data;
  },

  async crearSede(empresaId: number, data: CrearSedeInput): Promise<Sede> {
    const r = await apiClient.post<Sede>(`/empresas/${empresaId}/sedes/`, data);
    return r.data;
  },

  async actualizarSede(empresaId: number, sedeId: number, data: CrearSedeInput): Promise<Sede> {
    const r = await apiClient.patch<Sede>(`/empresas/${empresaId}/sedes/${sedeId}/`, data);
    return r.data;
  },
};