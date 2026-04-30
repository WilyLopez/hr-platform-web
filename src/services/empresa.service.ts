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

  async obtener(id: number): Promise<Empresa> {
    const r = await apiClient.get<Empresa>(`/empresas/${id}/`);
    return r.data;
  },

  async actualizar(id: number, data: ActualizarEmpresaInput): Promise<Empresa> {
    const r = await apiClient.patch<Empresa>(`/empresas/${id}/`, data);
    return r.data;
  },

  async suspender(id: number, razon: string): Promise<void> {
    await apiClient.post(`/empresas/${id}/suspender/`, { razon });
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