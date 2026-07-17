'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner, Badge, Tabs, TabList, TabTrigger, TabContent, Modal, Input, Skeleton } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import type { RegistroAsistencia } from "@/types/asistencia.types";
import { asistenciaService } from "@/services/asistencia.service";
import { 
  Search, 
  FileText, 
  Plus, 
  QrCode, 
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";
import Link from 'next/link';

export default function AsistenciaPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>([]);
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [busqueda, setBusqueda] = useState('');


  const [extras, setExtras] = useState<RegistroAsistencia[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [evaluatingExtra, setEvaluatingExtra] = useState<RegistroAsistencia | null>(null);
  const [minutosAprobados, setMinutosAprobados] = useState(0);
  const [comentarioAprobacion, setComentarioAprobacion] = useState("");

  const cargarExtras = async () => {
    setLoadingExtras(true);
    try {
      const data = await asistenciaService.listar({ fecha: filtroFecha, solo_extras: true } as any);
      setExtras(data);
    } catch (error) {
      toast.error("Error al cargar las horas extras.");
    } finally {
      setLoadingExtras(false);
    }
  };

  const cargarAsistencia = async () => {
    setLoading(true);
    try {
      const data = await asistenciaService.listar({ fecha: filtroFecha } as any);
      setAsistencias(data);
    } catch (error) {
      toast.error("Error al cargar los registros de asistencia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsistencia();
    cargarExtras();
  }, [filtroFecha]);

  const formatearHora = (fechaString?: string) => {
    if (!fechaString) return '--:--';
    return new Date(fechaString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Resumen del monitor (Semáforo)
  const resumenMonitor = useMemo(() => {
    const empleadosId = new Set();
    let presentes = 0;
    let tardanzas = 0;
    let fuera_horario = 0;

    asistencias.forEach(reg => {
      if (reg.tipo === "ENTRADA" && !empleadosId.has(reg.empleado_id)) {
        empleadosId.add(reg.empleado_id);
        presentes++;
        if (reg.resultado === "TARDE") tardanzas++;
        if (reg.resultado === "FUERA_HORARIO") fuera_horario++;
      }
    });

    return { presentes, tardanzas, fuera_horario, total: empleadosId.size };
  }, [asistencias]);

  const filtradas = asistencias.filter(item => {
    const nombre = item.empleado_nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const getResultadoColor = (resultado: string) => {
    switch(resultado) {
      case "NORMAL": return "success";
      case "TARDE": return "warning";
      case "TEMPRANO": return "warning";
      case "EXTRA": return "brand";
      case "FUERA_HORARIO": return "danger";
      default: return "neutral";
    }
  };


  const handleAprobarExtras = async (aprobar: boolean) => {
    if (!evaluatingExtra) return;
    try {
      await asistenciaService.aprobarExtras(
        evaluatingExtra.id,
        aprobar ? minutosAprobados : 0,
        comentarioAprobacion,
        aprobar
      );
      toast.success(aprobar ? "Horas extras aprobadas." : "Horas extras rechazadas.");
      setEvaluatingExtra(null);
      cargarExtras();
      cargarAsistencia(); // refresh monitor too
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Error al evaluar horas extras.");
    }
  };

  const getEstadoExtrasColor = (estado: string | null) => {
    switch(estado) {
      case "APROBADA": return "success";
      case "RECHAZADA": return "danger";
      case "PENDIENTE": return "warning";
      default: return "neutral";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case "VALIDO": return "success";
      case "CORREGIDO": return "info";
      case "RECHAZADO": return "danger";
      case "PENDIENTE_APROBACION": return "warning";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitor de Asistencia"
        description="Gestión en tiempo real de los marcajes del personal"
        action={
          <div className="flex gap-2">
            <Link href="/admin/asistencia/reporte">
              <Button variant="outline" leftIcon={<FileText size={18} />}>
                Reportes
              </Button>
            </Link>
            <Link href="/admin/asistencia/manual">
              <Button variant="outline" leftIcon={<Plus size={18} />}>
                Registro Manual
              </Button>
            </Link>
            <Link href="/admin/asistencia/qr/1">
              <Button variant="brand" leftIcon={<QrCode size={18} />}>
                Generar QR
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Semáforo */}
      
      <Tabs defaultValue="monitor">
        <TabList className="mb-4">
          <TabTrigger value="monitor" icon={Clock}>Monitor de Asistencia</TabTrigger>
          <TabTrigger value="extras" icon={CheckCircle2}>Horas Extras</TabTrigger>
        </TabList>
        <TabContent value="monitor">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-brand">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 text-brand rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Marcajes</p>
              <h3 className="text-2xl font-bold">{asistencias.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Presentes Hoy</p>
              <h3 className="text-2xl font-bold">{resumenMonitor.presentes}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Llegadas Tarde</p>
              <h3 className="text-2xl font-bold">{resumenMonitor.tardanzas}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Fuera de Horario</p>
              <h3 className="text-2xl font-bold">{resumenMonitor.fuera_horario}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar empleado..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <CalendarIcon size={18} className="text-slate-400" />
              <input
                type="date"
                className="outline-none text-sm"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                <th className="p-4 font-semibold text-slate-700">Empleado</th>
                <th className="p-4 font-semibold text-slate-700">Hora</th>
                <th className="p-4 font-semibold text-slate-700">Tipo</th>
                <th className="p-4 font-semibold text-slate-700">Origen</th>
                <th className="p-4 font-semibold text-slate-700">Sede</th>
                <th className="p-4 font-semibold text-slate-700">Resultado</th>
                <th className="p-4 font-semibold text-slate-700">Estado Aud.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                  </tr>
                ))
              ) : filtradas.length > 0 ? (
                filtradas.map((registro: any) => (
                  <tr key={registro.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{registro.empleado_nombre}</td>
                    <td className="p-4 text-slate-600 font-mono font-medium">{formatearHora(registro.timestamp)}</td>
                    <td className="p-4 text-slate-600">{registro.tipo.replace('_', ' ')}</td>
                    <td className="p-4 text-slate-600">{registro.origen}</td>
                    <td className="p-4 text-slate-600">{registro.sede_nombre}</td>
                    <td className="p-4">
                      <Badge variant={getResultadoColor(registro.resultado)}>
                        {registro.resultado}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getEstadoColor(registro.estado_auditoria)}>
                        {registro.estado_auditoria}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    No se encontraron marcajes en esta fecha.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

        </TabContent>

        <TabContent value="extras">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="p-4 font-semibold text-slate-700">Empleado</th>
                    <th className="p-4 font-semibold text-slate-700">Fecha/Hora</th>
                    <th className="p-4 font-semibold text-slate-700">Generadas (min)</th>
                    <th className="p-4 font-semibold text-slate-700">Aprobadas (min)</th>
                    <th className="p-4 font-semibold text-slate-700">Estado</th>
                    <th className="p-4 font-semibold text-slate-700 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingExtras ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-36" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="p-4 flex justify-end"><Skeleton className="h-8 w-20 rounded-md" /></td>
                      </tr>
                    ))
                  ) : extras.length > 0 ? (
                    extras.map((registro: any) => (
                      <tr key={registro.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{registro.empleado_nombre}</td>
                        <td className="p-4 text-slate-600 font-mono text-sm">{new Date(registro.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-slate-600 font-bold">{registro.minutos_extra} min</td>
                        <td className="p-4 text-slate-600 font-medium">
                          {registro.minutos_extra_aprobados !== null ? `${registro.minutos_extra_aprobados} min` : '-'}
                        </td>
                        <td className="p-4">
                          <Badge variant={getEstadoExtrasColor(registro.estado_extras)}>
                            {registro.estado_extras || "PENDIENTE"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          {registro.estado_extras === 'PENDIENTE' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setEvaluatingExtra(registro);
                                setMinutosAprobados(registro.minutos_extra);
                                setComentarioAprobacion("");
                              }}
                            >
                              Evaluar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-slate-500">
                        No hay horas extras registradas en esta fecha.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabContent>
      </Tabs>

      <Modal 
        open={!!evaluatingExtra} 
        onClose={() => setEvaluatingExtra(null)}
        title="Evaluar Horas Extras"
      >
        {evaluatingExtra && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Empleado: <strong>{evaluatingExtra.empleado_nombre}</strong><br />
              Horas extras generadas: <strong>{evaluatingExtra.minutos_extra} min</strong>
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Minutos a aprobar (máximo {evaluatingExtra.minutos_extra}):</label>
              <Input
                type="number"
                min={0}
                max={evaluatingExtra.minutos_extra}
                value={minutosAprobados}
                onChange={(e: any) => setMinutosAprobados(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comentario:</label>
              <Input
                type="text"
                placeholder="Opcional..."
                value={comentarioAprobacion}
                onChange={(e: any) => setComentarioAprobacion(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => handleAprobarExtras(false)}>
                Rechazar Todo
              </Button>
              <Button variant="brand" onClick={() => handleAprobarExtras(true)}>
                Aprobar
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
