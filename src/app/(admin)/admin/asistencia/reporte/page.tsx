'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { asistenciaService } from "@/services/asistencia.service";
import { useToast } from "@/hooks/useToast";
import type { ReporteAsistencia } from "@/types/asistencia.types";
import { 
  Search, 
  Calendar as CalendarIcon, 
  Download, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock 
} from "lucide-react";

export default function ReporteAsistenciaPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState<ReporteAsistencia | null>(null);

  // Valores por defecto: Primer y último día del mes actual
  const fechaActual = new Date();
  const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).toISOString().split('T')[0];
  const diaDeHoy = fechaActual.toISOString().split('T')[0];

  const [fechaDesde, setFechaDesde] = useState(primerDiaMes);
  const [fechaHasta, setFechaHasta] = useState(diaDeHoy);
  const [empleadoId, setEmpleadoId] = useState('');

  const generarReporte = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!empleadoId) {
      toast.error("Por favor, ingresa el ID del empleado.");
      return;
    }

    setLoading(true);
    try {
      const data = await asistenciaService.generarReporte({
        empleado_id: Number(empleadoId),
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      setReporte(data);
      toast.success("Reporte generado exitosamente.");
    } catch (error) {
      toast.error("Error al generar el reporte. Verifica los datos.");
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper para formatear el timestamp a fecha y hora legibles
  const formatearFechaHora = (isoString: string) => {
    const date = new Date(isoString);
    return {
      fecha: date.toLocaleDateString(),
      hora: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporte de Asistencia"
        description="Genera métricas y consolidado de marcajes por empleado"
        action={
          reporte && (
            <Button variant="outline" leftIcon={<Download size={18} />}>
              Exportar PDF
            </Button>
          )
        }
      />

      {/* Formulario de Filtros */}
      <Card>
        <CardBody>
          <form onSubmit={generarReporte} className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-1/3">
              <label className="form-label">ID de Empleado</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="number"
                  required
                  placeholder="Ej: 1045"
                  className="form-input pl-10"
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                />
              </div>
            </div>

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

            <Button type="submit" variant="brand" loading={loading} className="w-full md:w-auto px-8">
              <Search size={18} className="mr-2" />
              Buscar
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Resultados del Reporte */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Spinner size="lg" className="text-brand" />
          <p className="mt-4 text-muted-foreground">Procesando registros...</p>
        </div>
      ) : reporte ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <h3 className="text-lg font-semibold text-foreground">
            Resumen: {reporte.empleado_nombre}
          </h3>

          {/* Tarjetas de KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Días</p>
                  <p className="text-2xl font-bold text-foreground">{reporte.total_dias}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Presentes</p>
                  <p className="text-2xl font-bold text-foreground">{reporte.dias_presentes}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tardanzas</p>
                  <p className="text-2xl font-bold text-foreground">{reporte.tardanzas}</p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ausencias</p>
                  <p className="text-2xl font-bold text-foreground">{reporte.dias_ausentes}</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Tabla Detallada de Marcajes */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-slate-800/60 border-b border-neutral-200 dark:border-slate-800">
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Fecha</th>
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Hora</th>
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Tipo</th>
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Origen</th>
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Sede</th>
                    <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
                  {reporte.registros.length > 0 ? (
                    reporte.registros.map((registro) => {
                      const { fecha, hora } = formatearFechaHora(registro.timestamp);
                      return (
                        <tr key={registro.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="p-4 text-foreground font-medium">{fecha}</td>
                          <td className="p-4 text-neutral-600 dark:text-slate-300 font-mono">{hora}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              registro.tipo === 'ENTRADA' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                            }`}>
                              {registro.tipo}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-600 dark:text-slate-300 text-sm flex items-center gap-2">
                            {registro.origen}
                            {registro.origen === 'MANUAL' && <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">Manual</span>}
                          </td>
                          <td className="p-4 text-neutral-600 dark:text-slate-300 text-sm">{registro.sede_nombre || 'Sede Principal'}</td>
                          <td className="p-4">
                            {registro.resultado && registro.resultado !== 'NORMAL' && (
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                registro.resultado === 'TARDE' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                                registro.resultado === 'EXTRA' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' :
                                registro.resultado === 'FUERA_HORARIO' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' :
                                'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                {registro.resultado}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No hay registros de marcaje en este rango de fechas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}