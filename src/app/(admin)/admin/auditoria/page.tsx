'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { auditoriaService } from "@/services/auditoria.service";
import { useToast } from "@/hooks/useToast";
import type { RegistroAuditoria } from "@/types/auditoria.types";
import { 
  Search, 
  Download, 
  Calendar as CalendarIcon, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react";

export default function AuditoriaPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Estado para los datos (asumiendo que PaginatedResponse trae un array en 'results' o 'data')
  const [logs, setLogs] = useState<RegistroAuditoria[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false); // Dependerá de tu estructura PaginatedResponse

  // Filtros
  const fechaActual = new Date();
  const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).toISOString().split('T')[0];
  const diaDeHoy = fechaActual.toISOString().split('T')[0];

  const [fechaDesde, setFechaDesde] = useState(primerDiaMes);
  const [fechaHasta, setFechaHasta] = useState(diaDeHoy);
  const [tipoEvento, setTipoEvento] = useState('');

  const cargarAuditoria = async () => {
    setLoading(true);
    try {
      const response = await auditoriaService.listar({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        tipo_evento: tipoEvento || undefined,
        page: page
      });

      // Adaptación común para PaginatedResponse (ajusta 'results' al nombre real de tu propiedad de array)
      const data = (response as any).results || (response as any).data || response;
      setLogs(Array.isArray(data) ? data : []);
      
      // Ajusta esto según cómo tu backend envíe el total de páginas (ej. response.next !== null)
      setHasNextPage(Array.isArray(data) && data.length > 0); 
    } catch (error) {
      toast.error("Error al cargar los registros de auditoría.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAuditoria();
  }, [page]); // Recarga automáticamente al cambiar de página

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reiniciar a la página 1 al aplicar nuevos filtros
    cargarAuditoria();
  };

  const handleExportar = async (formato: "PDF" | "CSV") => {
    setExportLoading(true);
    try {
      const blob = await auditoriaService.exportar({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        formato
      });

      // Lógica nativa para forzar la descarga de un archivo Blob en el navegador
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `auditoria_${fechaDesde}_al_${fechaHasta}.${formato.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Reporte ${formato} descargado correctamente.`);
    } catch (error) {
      toast.error(`Error al generar el archivo ${formato}.`);
    } finally {
      setExportLoading(false);
    }
  };

  // Helper para mostrar la fecha/hora
  const formatearFechaHora = (isoString: string) => {
    const date = new Date(isoString);
    return {
      fecha: date.toLocaleDateString(),
      hora: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log de Auditoría"
        description="Registro inmutable de actividades y eventos del sistema"
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<Download size={16} />}
              onClick={() => handleExportar("CSV")}
              disabled={exportLoading}
            >
              CSV
            </Button>
            <Button 
              variant="brand" 
              size="sm" 
              leftIcon={<Download size={16} />}
              onClick={() => handleExportar("PDF")}
              loading={exportLoading}
            >
              Exportar PDF
            </Button>
          </div>
        }
      />

      {/* Panel de Filtros */}
      <Card>
        <CardBody>
          <form onSubmit={handleBuscar} className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-1/4">
              <label className="form-label">Desde</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-background border-border focus-within:ring-2 focus-within:ring-brand">
                <CalendarIcon size={18} className="text-muted-foreground" />
                <input
                  type="date"
                  required
                  className="w-full outline-none text-sm bg-transparent text-foreground"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <label className="form-label">Hasta</label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-background border-border focus-within:ring-2 focus-within:ring-brand">
                <CalendarIcon size={18} className="text-muted-foreground" />
                <input
                  type="date"
                  required
                  className="w-full outline-none text-sm bg-transparent text-foreground"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <label className="form-label">Tipo de Evento</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Ej: LOGIN, CREAR_USUARIO..."
                  className="form-input pl-10"
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" variant="brand" className="w-full md:w-auto px-6">
              <Search size={18} className="mr-2" />
              Filtrar
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Tabla de Logs */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900 dark:bg-slate-950 text-white border-b border-neutral-700 dark:border-slate-800">
                <th className="p-4 font-semibold text-sm rounded-tl-lg">Timestamp</th>
                <th className="p-4 font-semibold text-sm">Evento</th>
                <th className="p-4 font-semibold text-sm">Usuario / Rol</th>
                <th className="p-4 font-semibold text-sm">Descripción</th>
                <th className="p-4 font-semibold text-sm rounded-tr-lg">IP / Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Spinner size="md" className="mx-auto" />
                    <p className="mt-2 text-xs text-muted-foreground">Recuperando logs del sistema...</p>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => {
                  const { fecha, hora } = formatearFechaHora(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="p-4">
                        <div className="text-sm font-medium text-foreground">{fecha}</div>
                        <div className="text-xs text-muted-foreground font-mono">{hora}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 dark:bg-slate-800 text-neutral-800 dark:text-slate-200 border border-neutral-200 dark:border-slate-700">
                          <Activity size={12} className="text-brand dark:text-brand-light" />
                          {log.tipo_evento}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground font-medium">ID: {log.usuario_id || 'Sistema'}</div>
                        <div className="text-xs text-muted-foreground">{log.rol_usuario || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-sm text-neutral-600 dark:text-slate-300 max-w-xs">
                        {log.descripcion}
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-mono text-muted-foreground mb-1">IP: {log.ip_address || '127.0.0.1'}</div>
                        {log.detalles && Object.keys(log.detalles).length > 0 && (
                          <details className="text-xs text-muted-foreground cursor-pointer">
                            <summary className="hover:text-brand dark:hover:text-brand-light">Ver JSON</summary>
                            <pre className="mt-2 p-2 bg-neutral-50 dark:bg-slate-800/60 rounded border border-neutral-200 dark:border-slate-700 overflow-x-auto text-[10px] text-neutral-600 dark:text-slate-300">
                              {JSON.stringify(log.detalles, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                    No se encontraron registros de auditoría con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-800/40">
          <span className="text-sm text-muted-foreground">Página {page}</span>
          <div className="flex gap-2">
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