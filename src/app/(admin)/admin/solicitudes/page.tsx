'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { solicitudService } from "@/services/solicitud.service";
import { useToast } from "@/hooks/useToast";
import type { Solicitud, EstadoSolicitud } from "@/types/solicitud.types";
import { 
  Search, 
  Eye, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  FileText,
  Clock
} from "lucide-react";
import Link from 'next/link';

export default function BandejaSolicitudesPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  
  // Estados para datos de solicitudes y paginación
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Estados de filtros
  const [estado, setEstado] = useState<EstadoSolicitud | ''>('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await solicitudService.listar({
        estado: estado || undefined,
        empleado_id: empleadoId ? Number(empleadoId) : undefined,
        fecha_desde: fechaDesde || undefined,
        fecha_hasta: fechaHasta || undefined,
        page: page
      });

      // Adaptación segura para PaginatedResponse (extrae el array sin romper TypeScript)
      const data = (response as any).results || (response as any).data || response;
      setSolicitudes(Array.isArray(data) ? data : []);
      
      // Metadatos de paginación
      setTotalItems((response as any).count || (response as any).total || (Array.isArray(data) ? data.length : 0));
      setHasNextPage((response as any).next !== null && Array.isArray(data) && data.length > 0);
    } catch (error) {
      toast.error("Error al cargar la bandeja de solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  // Recargar automáticamente cuando la página cambie
  useEffect(() => {
    cargarSolicitudes();
  }, [page]);

  // Ejecutar búsqueda con filtros manuales
  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reiniciar a la primera página al aplicar nuevos filtros
    cargarSolicitudes();
  };

  // Helper para dar formato estético a los estados
  const obtenerEstiloEstado = (est: EstadoSolicitud) => {
    switch (est) {
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EN_REVISION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'APROBADA':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'RECHAZADA':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CANCELADA':
        return 'bg-neutral-100 text-neutral-500 border-neutral-300';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const formatearFecha = (stringIso: string) => {
    return new Date(stringIso).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bandeja de Solicitudes"
        description="Evalúa, aprueba o rechaza los permisos y licencias solicitados por el personal"
      />

      {/* Panel Multifiltros */}
      <Card>
        <CardBody>
          <form onSubmit={handleFiltrar} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            
            {/* ID Empleado */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">ID de Empleado</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  type="number"
                  placeholder="Ej: 1045"
                  className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                />
              </div>
            </div>

            {/* Filtrar por Estado */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Estado</label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-sm text-neutral-800 outline-none bg-white focus:ring-2 focus:ring-brand"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoSolicitud | '')}
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="EN_REVISION">EN REVISIÓN</option>
                <option value="APROBADA">APROBADA</option>
                <option value="RECHAZADA">RECHAZADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Desde</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand">
                <CalendarIcon size={16} className="text-neutral-400" />
                <input
                  type="date"
                  className="w-full outline-none text-xs text-neutral-800"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Hasta</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-brand">
                <CalendarIcon size={16} className="text-neutral-400" />
                <input
                  type="date"
                  className="w-full outline-none text-xs text-neutral-800"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
            </div>

            {/* Botón Aplicar */}
            <Button type="submit" variant="brand" className="w-full">
              <Filter size={16} className="mr-2" />
              Filtrar Tray
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Tabla Principal de Solicitudes */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 font-semibold text-neutral-700 text-xs">Empleado</th>
                <th className="p-4 font-semibold text-neutral-700 text-xs">Tipo de Permiso</th>
                <th className="p-4 font-semibold text-neutral-700 text-xs">Período Solicitado</th>
                <th className="p-4 font-semibold text-neutral-700 text-xs text-center">Días</th>
                <th className="p-4 font-semibold text-neutral-700 text-xs text-center">Estado</th>
                <th className="p-4 font-semibold text-neutral-700 text-xs text-right">Evaluación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Spinner size="md" className="mx-auto" />
                    <p className="mt-2 text-xs text-neutral-500">Recuperando solicitudes pendientes...</p>
                  </td>
                </tr>
              ) : solicitudes.length > 0 ? (
                solicitudes.map((sol) => (
                  <tr key={sol.id} className="hover:bg-neutral-50/40 transition-colors">
                    {/* Empleado */}
                    <td className="p-4">
                      <div className="font-semibold text-neutral-800 text-sm">{sol.empleado_nombre}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">ID Colaborador: {sol.empleado_id}</div>
                    </td>

                    {/* Tipo Permiso */}
                    <td className="p-4 text-sm text-neutral-700 font-medium">
                      {sol.tipo_permiso_nombre}
                    </td>

                    {/* Período */}
                    <td className="p-4 text-xs text-neutral-600">
                      <div className="flex items-center gap-1 font-medium">
                        <CalendarIcon size={12} className="text-neutral-400" />
                        <span>{sol.fecha_inicio === sol.fecha_fin ? formatearFecha(sol.fecha_inicio) : `${formatearFecha(sol.fecha_inicio)} al ${formatearFecha(sol.fecha_fin)}`}</span>
                      </div>
                      {sol.hora_inicio && sol.hora_fin && (
                        <div className="flex items-center gap-1 mt-1 text-indigo-600 font-medium">
                          <Clock size={12} />
                          <span>{sol.hora_inicio.slice(0,5)} - {sol.hora_fin.slice(0,5)}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-neutral-400 mt-1 truncate max-w-[180px]" title={sol.motivo}>
                        Motivo: {sol.motivo}
                      </div>
                      {sol.adjunto_url && (
                        <a href={sol.adjunto_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-1 text-xs text-brand-600 hover:underline">
                          <FileText size={12} />
                          Ver adjunto
                        </a>
                      )}
                    </td>

                    {/* Días */}
                    <td className="p-4 text-sm font-bold text-neutral-700 text-center">
                      {sol.dias_solicitados} d
                    </td>

                    {/* Estado Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${obtenerEstiloEstado(sol.estado)}`}>
                        {sol.estado}
                      </span>
                    </td>

                    {/* Acciones de Revisión */}
                    <td className="p-4 text-right">
                      <Link href={`/admin/solicitudes/${sol.id}`}>
                        <Button 
                          variant={sol.estado === 'PENDIENTE' ? 'brand' : 'outline'} 
                          size="sm"
                          leftIcon={<Eye size={14} />}
                        >
                          {sol.estado === 'PENDIENTE' ? 'Revisar' : 'Ver Ficha'}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-neutral-500">
                    No se encontraron solicitudes registradas en este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador Inferior */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          <span className="text-xs text-neutral-500 font-medium">
            Página {page} {totalItems > 0 && `• Registros totales: ${totalItems}`}
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