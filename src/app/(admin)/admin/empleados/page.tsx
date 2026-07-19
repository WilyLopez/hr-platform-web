'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner, Skeleton } from "@/components/ui";
import { empleadoService } from "@/services/empleado.service";
import { apiClient } from "@/lib/axios";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import type { Empleado, EstadoEmpleado } from "@/types/empleado.types";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit2, 
  UserX, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Briefcase
} from "lucide-react";
import Link from 'next/link';

export default function EmpleadosPage() {
  const toast = useToast();
  const { usuario } = useAuth();
  const empresaId = usuario?.empresa_id;
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Estados de datos y paginación
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Estados de filtros
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<EstadoEmpleado | ''>('');
  const [area, setArea] = useState('');
  const [sedeId, setSedeId] = useState('');

  // Estados para hacer el filtro de sedes dinámico
  const [sedesDisponibles, setSedesDisponibles] = useState<{id: number, nombre: string}[]>([]);
  const [cargandoSedes, setCargandoSedes] = useState(true);

  // Cargar sedes al montar el componente para el filtro
  useEffect(() => {
    if (!empresaId) return;
    const cargarSedes = async () => {
      try {
        const res = await apiClient.get(`empresas/${empresaId}/sedes/`);
        const lista = res.data.results || res.data;
        setSedesDisponibles(lista);
      } catch {
        // Silencioso — no saturar con toasts por un filtro secundario
      } finally {
        setCargandoSedes(false);
      }
    };
    cargarSedes();
  }, [empresaId]);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const response = await empleadoService.listar({
        search: search.trim() || undefined,
        estado: estado || undefined,
        area: area.trim() || undefined,
        sede_id: sedeId ? Number(sedeId) : undefined,
        page: page
      });

      // Adaptación segura para PaginatedResponse
      const data = (response as any).results || (response as any).data || response;
      setEmpleados(Array.isArray(data) ? data : []);
      
      // Intentar recuperar metadatos de paginación si tu API los provee
      setTotalItems((response as any).count || (response as any).total || (Array.isArray(data) ? data.length : 0));
      setHasNextPage((response as any).next !== null && Array.isArray(data) && data.length > 0);
    } catch (error) {
      toast.error("Error al cargar el listado de empleados.");
    } finally {
      setLoading(false);
    }
  };

  // Recargar cuando cambie la página
  useEffect(() => {
    cargarEmpleados();
  }, [page]);

  // Manejador del formulario de filtros
  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reiniciar a la primera página al filtrar
    cargarEmpleados();
  };

  // Alternar el estado Activo/Inactivo de un empleado (Acción rápida)
  const handleToggleEstado = async (id: number, estadoActual: EstadoEmpleado) => {
    setActionLoading(id);
    try {
      if (estadoActual === 'ACTIVO') {
        await empleadoService.desactivar(id);
        toast.success("Empleado desactivado correctamente.");
      } else {
        await empleadoService.reactivar(id);
        toast.success("Empleado reactivado correctamente.");
      }
      cargarEmpleados(); // Recargar datos locales
    } catch (error) {
      toast.error("No se pudo cambiar el estado del colaborador.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Empleados"
        description="Listado, filtros y administración del personal de la empresa"
        action={
          <Link href="/admin/empleados/nuevo">
            <Button variant="brand" leftIcon={<Plus size={18} />}>
              Registrar Empleado
            </Button>
          </Link>
        }
      />

      {/* Barra Multifiltros */}
      <Card>
        <CardBody>
          <form onSubmit={handleBuscar} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            {/* Búsqueda por texto */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Buscar por nombre o documento</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez o 745896..."
                  className="form-input pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Estado</label>
              <select
                className="form-input"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoEmpleado | '')}
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>

            {/* Filtro por Sede (Dinámico) */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Sede</label>
              <select
                className="form-input disabled:opacity-50"
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                disabled={cargandoSedes}
              >
                <option value="">
                  {cargandoSedes ? "Cargando sedes..." : "Todas las sedes"}
                </option>
                
                {sedesDisponibles.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Aplicar */}
            <Button type="submit" variant="brand" className="w-full">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Tabla Principal */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-slate-800/60 border-b border-neutral-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs">Código / Colaborador</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs">Identificación</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs">Área / Cargo</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs">Sede</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs text-center">Estado</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-xs text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-56 mt-1.5" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-20 mt-1.5" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                    <td className="p-4"><div className="flex justify-end gap-1.5"><Skeleton className="h-8 w-8 rounded-lg" /><Skeleton className="h-8 w-8 rounded-lg" /><Skeleton className="h-8 w-8 rounded-lg" /></div></td>
                  </tr>
                ))
              ) : empleados.length > 0 ? (
                empleados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Código y Nombre */}
                    <td className="p-4">
                      <div className="font-semibold text-foreground text-sm">
                        {emp.nombres} {emp.apellidos}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        {emp.codigo_unico} • {emp.correo}
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="p-4 text-sm text-neutral-600 dark:text-slate-300">
                      <span className="font-medium text-muted-foreground text-xs mr-1">{emp.tipo_documento}:</span>
                      {emp.numero_documento}
                    </td>

                    {/* Área y Cargo */}
                    <td className="p-4">
                      <div className="text-sm text-foreground font-medium">{emp.cargo}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Briefcase size={12} className="text-muted-foreground" />
                        {emp.area}
                      </div>
                    </td>

                    {/* Sede */}
                    <td className="p-4 text-sm text-neutral-600 dark:text-slate-300">
                      {emp.sede_nombre || 'No asignada'}
                    </td>

                    {/* Estado */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        emp.estado === 'ACTIVO'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/40'
                          : 'bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400 border border-neutral-200 dark:border-slate-700'
                      }`}>
                        {emp.estado}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* Perfil */}
                        <Link href={`/admin/empleados/${emp.id}`}>
                          <Button variant="outline" size="sm" title="Ver perfil">
                            <Eye size={14} />
                          </Button>
                        </Link>

                        {/* Editar */}
                        <Link href={`/admin/empleados/${emp.id}/editar`}>
                          <Button variant="outline" size="sm" title="Editar datos">
                            <Edit2 size={14} />
                          </Button>
                        </Link>

                        {/* Alta/Baja */}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionLoading === emp.id}
                          onClick={() => handleToggleEstado(emp.id, emp.estado)}
                          title={emp.estado === 'ACTIVO' ? 'Desactivar empleado' : 'Reactivar empleado'}
                          className={emp.estado === 'ACTIVO' ? 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'}
                        >
                          {actionLoading === emp.id ? (
                            <Spinner size="xs" />
                          ) : emp.estado === 'ACTIVO' ? (
                            <UserX size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                    No se encontraron colaboradores con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-800/30">
          <span className="text-xs text-muted-foreground font-medium">
            Página {page} {totalItems > 0 && `• Total: ${totalItems} empleados`}
          </span>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage || loading}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}