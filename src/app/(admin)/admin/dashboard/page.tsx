'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { empleadoService } from "@/services/empleado.service";
import { solicitudService } from "@/services/solicitud.service";
import { Users, Clock, FileText, AlertTriangle, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      try {
        // Ejecutamos ambas peticiones en paralelo para mayor velocidad
        const [empleadosRes, solicitudesRes] = await Promise.all([
          empleadoService.listar({ estado: "ACTIVO", page: 1, page_size: 5 }),
          solicitudService.listar({ estado: "PENDIENTE", page: 1 })
        ]);

        // Adaptación para PaginatedResponse
        const empData = (empleadosRes as any).results || (empleadosRes as any).data || empleadosRes;
        const solData = (solicitudesRes as any).results || (solicitudesRes as any).data || solicitudesRes;

        setEmpleadosRecientes(Array.isArray(empData) ? empData.slice(0, 5) : []);
        setEmpleadosActivos((empleadosRes as any).count || (Array.isArray(empData) ? empData.length : 0));

        setSolicitudesRecientes(Array.isArray(solData) ? solData.slice(0, 5) : []);
        setSolicitudesPendientes((solicitudesRes as any).count || (Array.isArray(solData) ? solData.length : 0));

      } catch (error) {
        console.error("Error al cargar los datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  // Helper local para formatear fechas
  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Resumen operativo y métricas de Recursos Humanos" 
      />

      {/* Tarjetas de Métricas (StatCards integradas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card: Empleados Activos */}
        <Card>
          <CardBody className="flex items-center gap-4 p-4">
            <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Empleados activos</p>
              <h4 className="text-2xl font-bold text-neutral-800">
                {loading ? <Spinner size="sm" /> : empleadosActivos}
              </h4>
            </div>
          </CardBody>
        </Card>

        {/* Card: Solicitudes Pendientes */}
        <Card>
          <CardBody className="flex items-center gap-4 p-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Permisos pendientes</p>
              <h4 className="text-2xl font-bold text-neutral-800">
                {loading ? <Spinner size="sm" /> : solicitudesPendientes}
              </h4>
            </div>
          </CardBody>
        </Card>

        {/* Card: Marcajes Hoy (Mock/Placeholder para futura integración) */}
        <Card>
          <CardBody className="flex items-center gap-4 p-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Marcajes hoy</p>
              <h4 className="text-2xl font-bold text-neutral-800">
                {loading ? <Spinner size="sm" /> : "—"}
              </h4>
            </div>
          </CardBody>
        </Card>

        {/* Card: Tardanzas Hoy (Mock/Placeholder para futura integración) */}
        <Card>
          <CardBody className="flex items-center gap-4 p-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Tardanzas hoy</p>
              <h4 className="text-2xl font-bold text-neutral-800">
                {loading ? <Spinner size="sm" /> : "—"}
              </h4>
            </div>
          </CardBody>
        </Card>

      </div>

      {/* Tablas de Resumen */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Panel: Solicitudes Pendientes */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-800">Solicitudes por revisar</h3>
            <Link href="/admin/solicitudes">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                Ver todas
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-xs text-neutral-500 border-b">
                  <th className="p-3 font-semibold">Empleado</th>
                  <th className="p-3 font-semibold">Tipo</th>
                  <th className="p-3 font-semibold">Desde</th>
                  <th className="p-3 font-semibold text-center">Días</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center"><Spinner size="md" className="mx-auto" /></td>
                  </tr>
                ) : solicitudesRecientes.length > 0 ? (
                  solicitudesRecientes.map((sol) => (
                    <tr key={sol.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 text-sm font-medium text-neutral-800">{sol.empleado_nombre}</td>
                      <td className="p-3 text-sm text-neutral-600">{sol.tipo_permiso_nombre}</td>
                      <td className="p-3 text-sm text-neutral-600">{formatearFecha(sol.fecha_inicio)}</td>
                      <td className="p-3 text-sm font-bold text-neutral-700 text-center">{sol.dias_solicitados}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm text-neutral-500">
                      No hay solicitudes pendientes de revisión.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Panel: Empleados Recientes */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h3 className="font-bold text-neutral-800">Últimas incorporaciones</h3>
            <Link href="/admin/empleados">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                Ver directorio
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-xs text-neutral-500 border-b">
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold">Cargo</th>
                  <th className="p-3 font-semibold text-right">Ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center"><Spinner size="md" className="mx-auto" /></td>
                  </tr>
                ) : empleadosRecientes.length > 0 ? (
                  empleadosRecientes.map((emp) => (
                    <tr key={emp.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3">
                        <div className="text-sm font-medium text-neutral-800">
                          {emp.nombres} {emp.apellidos}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-neutral-600">{emp.cargo}</td>
                      <td className="p-3 text-sm text-neutral-500 text-right">
                        {formatearFecha(emp.fecha_ingreso)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-sm text-neutral-500">
                      No hay empleados registrados recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}