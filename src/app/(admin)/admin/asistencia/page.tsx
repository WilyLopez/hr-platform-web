'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { asistenciaService } from "@/services/asistencia.service";
import { useToast } from "@/hooks/useToast";
import type { RegistroAsistencia } from "@/types/asistencia.types"; // <-- Agregado para el tipado
import { 
  Search, 
  FileText, 
  Plus, 
  QrCode, 
  Calendar as CalendarIcon 
} from "lucide-react";
import Link from 'next/link';

export default function AsistenciaPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  // Le indicamos a TS que el estado es un array de RegistroAsistencia
  const [asistencias, setAsistencias] = useState<RegistroAsistencia[]>([]);
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [busqueda, setBusqueda] = useState('');

  const cargarAsistencia = async () => {
    setLoading(true);
    try {
      // Usamos el método correcto: listar() pasándole un objeto compatible con FiltrosAsistencia
      // *Nota: Asumo que en tu backend filtras por 'fecha', si es otro nombre (ej. 'fecha_inicio'), cámbialo aquí.
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
  }, [filtroFecha]);

  // Filtrado local por nombre de empleado
  // *Nota: Asumo que tu tipo RegistroAsistencia tiene 'empleado_nombre'. Si es un objeto anidado (ej. item.empleado.nombre), ajusta esta línea.
  const asistenciasFiltradas = asistencias.filter(item => {
    const nombre = (item as any).empleado_nombre || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  // Helper para formatear la hora de forma nativa sin depender de formatTime
  const formatearHora = (fechaString?: string) => {
    if (!fechaString) return '--:--';
    return new Date(fechaString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Control de Asistencia"
        description="Monitoreo de entradas y salidas del personal"
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

      {/* Barra de Filtros */}
      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Buscar empleado..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <CalendarIcon size={18} className="text-neutral-400" />
              <input
                type="date"
                className="outline-none text-sm"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            Mostrando: <strong>{asistenciasFiltradas.length}</strong> registros
          </div>
        </CardBody>
      </Card>

      {/* Tabla de Resultados */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 font-semibold text-neutral-700">Empleado</th>
                <th className="p-4 font-semibold text-neutral-700">Entrada</th>
                <th className="p-4 font-semibold text-neutral-700">Salida</th>
                <th className="p-4 font-semibold text-neutral-700">Sede</th>
                <th className="p-4 font-semibold text-neutral-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Spinner size="md" className="mx-auto" />
                    <p className="mt-2 text-neutral-500">Cargando registros...</p>
                  </td>
                </tr>
              ) : asistenciasFiltradas.length > 0 ? (
                asistenciasFiltradas.map((registro: any) => (
                  <tr key={registro.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-800">{registro.empleado_nombre}</td>
                    <td className="p-4 text-neutral-600 font-mono">{formatearHora(registro.hora_entrada)}</td>
                    <td className="p-4 text-neutral-600 font-mono">{formatearHora(registro.hora_salida)}</td>
                    <td className="p-4 text-neutral-600">{registro.sede_nombre}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        registro.estado === 'puntual' ? 'bg-green-100 text-green-700' : 
                        registro.estado === 'tardanza' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {registro.estado ? registro.estado.toUpperCase() : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-neutral-500">
                    No se encontraron registros para esta fecha.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}