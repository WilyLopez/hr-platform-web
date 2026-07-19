'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Skeleton } from "@/components/ui";
import { StatCard } from "@/components/charts/StatCard";
import { TableEmptyState } from "@/components/tables/TableEmptyState";
import { empleadoService } from "@/services/empleado.service";
import { solicitudService } from "@/services/solicitud.service";
import { asistenciaService } from "@/services/asistencia.service";
import { Users, Clock, FileText, AlertTriangle, ArrowRight, CheckCircle2, Circle, Calendar } from "lucide-react";
import Link from "next/link";
import type { Empleado } from "@/types/empleado.types";
import type { Solicitud } from "@/types/solicitud.types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // Estados para métricas y tablas
  const [empleadosActivos, setEmpleadosActivos] = useState<number>(0);
  const [empleadosRecientes, setEmpleadosRecientes] = useState<Empleado[]>([]);
  
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<number>(0);
  const [solicitudesRecientes, setSolicitudesRecientes] = useState<Solicitud[]>([]);
  const [proximosEventos, setProximosEventos] = useState<Solicitud[]>([]);

  // Nuevos estados para asistencias
  const [marcajesHoy, setMarcajesHoy] = useState<number>(0);
  const [tardanzasHoy, setTardanzasHoy] = useState<number>(0);

  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      try {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, "0");
        const day = String(hoy.getDate()).padStart(2, "0");
        const fechaFormateada = `${year}-${month}-${day}`;

        const [empleadosRes, solicitudesRes, asistenciaRes, eventosRes] = await Promise.all([
          empleadoService.listar({ estado: "ACTIVO", page: 1, page_size: 5 }),
          solicitudService.listar({ estado: "PENDIENTE", page: 1 }),
          asistenciaService.listar({ fecha_desde: fechaFormateada, fecha_hasta: fechaFormateada }).catch(() => []),
          solicitudService.listar({ estado: "APROBADA", page: 1, page_size: 6 }).catch(() => ({ results: [] })),
        ]);

        const empData = (empleadosRes as any).results || (empleadosRes as any).data || empleadosRes;
        const solData = (solicitudesRes as any).results || (solicitudesRes as any).data || solicitudesRes;
        const eventosData = (eventosRes as any).results || (eventosRes as any).data || [];

        setEmpleadosRecientes(Array.isArray(empData) ? empData.slice(0, 5) : []);
        setEmpleadosActivos((empleadosRes as any).count || (Array.isArray(empData) ? empData.length : 0));

        setSolicitudesRecientes(Array.isArray(solData) ? solData.slice(0, 5) : []);
        setSolicitudesPendientes((solicitudesRes as any).count || (Array.isArray(solData) ? solData.length : 0));

        // Filtrar solicitudes aprobadas con fecha futura (próximos eventos)
        const hoyDate = new Date(fechaFormateada);
        const eventos = Array.isArray(eventosData)
          ? eventosData
              .filter((s: Solicitud) => new Date(s.fecha_inicio) >= hoyDate)
              .sort((a: Solicitud, b: Solicitud) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())
              .slice(0, 3)
          : [];
        setProximosEventos(eventos);

        const asisData = (asistenciaRes as any).results || (asistenciaRes as any).data || asistenciaRes;
        const arrAsistencias = Array.isArray(asisData) ? asisData : [];
        
        setMarcajesHoy(arrAsistencias.length);
        setTardanzasHoy(arrAsistencias.filter((a: any) => a.resultado === 'TARDE').length);

      } catch (error) {
        console.error("Error al cargar los datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Resumen operativo y métricas de Recursos Humanos" 
      />

      {/* Onboarding View para Nuevas Empresas */}
      {!loading && empleadosActivos === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenido a NexusRH</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Tu espacio de trabajo está listo. Para comenzar a aprovechar la plataforma, te sugerimos seguir estos pasos:
          </p>
          
          <div className="flex flex-col gap-3 text-left w-full max-w-sm">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md text-foreground">
              <CheckCircle2 size={18} className="text-success" /> 
              <span className="font-medium line-through text-muted-foreground">Registrar empresa</span>
            </div>
            <Link href="/admin/empleados/nuevo" className="flex items-center gap-3 p-3 border border-primary/30 bg-primary/5 rounded-md hover:border-primary/60 transition-colors cursor-pointer group">
              <Circle size={18} className="text-primary group-hover:fill-primary/20" /> 
              <span className="font-medium text-primary">Agregar tu primer empleado</span>
            </Link>
            <div className="flex items-center gap-3 p-3 border border-border rounded-md opacity-60">
              <Circle size={18} className="text-muted-foreground" /> 
              <span className="text-muted-foreground">Configurar horarios</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-md opacity-60">
              <Circle size={18} className="text-muted-foreground" /> 
              <span className="text-muted-foreground">Crear tipos de permiso</span>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Tarjetas de Métricas (StatCards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Empleados activos"
              value={empleadosActivos}
              icon={Users}
              variant="brand"
              isLoading={loading}
              trend={{ value: 12, label: "nuevos este mes" }}
            />
            <StatCard
              title="Permisos pendientes"
              value={solicitudesPendientes}
              icon={AlertTriangle}
              variant="warning"
              isLoading={loading}
              trend={{ value: 5, label: "vs semana pasada" }}
            />
            <StatCard
              title="Marcajes hoy"
              value={marcajesHoy}
              icon={Clock}
              variant="success"
              isLoading={loading}
            />
            <StatCard
              title="Tardanzas hoy"
              value={tardanzasHoy}
              icon={FileText}
              variant={tardanzasHoy > 0 ? "danger" : "neutral"}
              isLoading={loading}
            />
          </div>

          {/* Grilla Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Panel: Solicitudes Pendientes */}
            <Card className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-bold text-foreground">Solicitudes por revisar</h3>
                <Link href="/admin/solicitudes">
                  <Button variant="outline" size="md" rightIcon={<ArrowRight size={14} />}>
                    Ver todas
                  </Button>
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-xs text-muted-foreground border-b border-border">
                      <th className="p-3 font-semibold">Empleado</th>
                      <th className="p-3 font-semibold">Tipo</th>
                      <th className="p-3 font-semibold">Desde</th>
                      <th className="p-3 font-semibold text-center">Días</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          <td className="p-3"><Skeleton className="h-5 w-32" /></td>
                          <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="p-3"><Skeleton className="h-5 w-20" /></td>
                          <td className="p-3"><Skeleton className="h-5 w-8 mx-auto" /></td>
                        </tr>
                      ))
                    ) : solicitudesRecientes.length > 0 ? (
                      solicitudesRecientes.map((sol) => (
                        <tr key={sol.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-3 text-sm font-medium text-foreground">{sol.empleado_nombre}</td>
                          <td className="p-3 text-sm text-muted-foreground">{sol.tipo_permiso_nombre}</td>
                          <td className="p-3 text-sm text-muted-foreground">{formatearFecha(sol.fecha_inicio)}</td>
                          <td className="p-3 text-sm font-bold text-foreground text-center">{sol.dias_solicitados}</td>
                        </tr>
                      ))
                    ) : (
                      <TableEmptyState 
                        colSpan={4} 
                        icon={FileText}
                        title="No existen solicitudes pendientes"
                        description="Cuando los colaboradores envíen solicitudes aparecerán aquí."
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Panel: Empleados Recientes */}
            <Card className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-bold text-foreground">Últimas incorporaciones</h3>
                <Link href="/admin/empleados">
                  <Button variant="outline" size="md" rightIcon={<ArrowRight size={14} />}>
                    Ver directorio
                  </Button>
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-xs text-muted-foreground border-b border-border">
                      <th className="p-3 font-semibold">Nombre</th>
                      <th className="p-3 font-semibold">Cargo</th>
                      <th className="p-3 font-semibold text-right">Ingreso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          <td className="p-3"><Skeleton className="h-5 w-40" /></td>
                          <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                          <td className="p-3"><Skeleton className="h-5 w-20 ml-auto" /></td>
                        </tr>
                      ))
                    ) : empleadosRecientes.length > 0 ? (
                      empleadosRecientes.map((emp) => (
                        <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="text-sm font-medium text-foreground">
                              {emp.nombres} {emp.apellidos}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">{emp.cargo}</td>
                          <td className="p-3 text-sm text-muted-foreground text-right">
                            {formatearFecha(emp.fecha_ingreso)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <TableEmptyState 
                        colSpan={3} 
                        icon={Users}
                        title="Sin incorporaciones recientes"
                        description="Cuando agregues nuevos colaboradores aparecerán aquí."
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* Fila de Próximos Eventos — datos reales desde solicitudes aprobadas */}
          <Card>
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
              <h3 className="font-bold text-foreground">Próximos Permisos y Vacaciones</h3>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : proximosEventos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No hay permisos o vacaciones aprobadas próximas.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {proximosEventos.map((evento) => {
                    const diasDiferencia = Math.ceil(
                      (new Date(evento.fecha_inicio).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    const cuandoText =
                      diasDiferencia === 0 ? "Hoy" :
                      diasDiferencia === 1 ? "Mañana" :
                      `En ${diasDiferencia} días`;
                    return (
                      <div key={evento.id} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                          <Calendar size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {evento.empleado_nombre}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {evento.tipo_permiso_nombre} • {cuandoText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}