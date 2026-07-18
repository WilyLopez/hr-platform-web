'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { empleadoService } from "@/services/empleado.service";
import { useToast } from "@/hooks/useToast";
import type { Empleado } from "@/types/empleado.types";
import { 
  ArrowLeft, 
  Edit2, 
  User, 
  Mail, 
  Briefcase, 
  CreditCard, 
  MapPin, 
  Calendar,
  UserX,
  UserCheck,
  Hash,
  Fingerprint
} from "lucide-react";
import Link from 'next/link';
import { AsignacionesEmpleado } from "@/components/horarios/AsignacionesEmpleado";

export default function DetalleEmpleadoPage({ params }: { params: { id: string } }) {
  // En Next 13/14 leemos directamente el objeto params de forma síncrona
  const id = parseInt(params.id, 10);
  const router = useRouter();
  const toast = useToast();
  
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const cargarEmpleado = async () => {
    setLoading(true);
    try {
      const data = await empleadoService.obtener(id);
      setEmpleado(data);
    } catch (error) {
      toast.error("No se pudo cargar la información del colaborador.");
      router.push('/admin/empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarEmpleado();
    }
  }, [id]);

  const handleToggleEstado = async () => {
    if (!empleado) return;
    setActionLoading(true);
    try {
      if (empleado.estado === 'ACTIVO') {
        await empleadoService.desactivar(id);
        toast.success("Colaborador desactivado correctamente.");
      } else {
        await empleadoService.reactivar(id);
        toast.success("Colaborador reactivado correctamente.");
      }
      cargarEmpleado(); // Recargar datos locales modificados
    } catch (error) {
      toast.error("Error al cambiar el estado del colaborador.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-brand" />
        <p className="mt-4 text-xs text-neutral-500 font-medium">Cargando perfil del colaborador...</p>
      </div>
    );
  }

  if (!empleado) return null;

  // Obtener iniciales para el avatar visual
  const iniciales = `${empleado.nombres[0] || ''}${empleado.apellidos[0] || ''}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Encabezado con navegación de regreso */}
      <PageHeader
        title="Perfil del Empleado"
        description={`Ficha de información interna para ${empleado.nombres}`}
        action={
          <Link href="/admin/empleados">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver al listado
            </Button>
          </Link>
        }
      />

      {/* Tarjeta de Presentación Principal */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Avatar Placeholder */}
            <div className="w-20 h-20 bg-brand-pale text-brand-dark rounded-full flex items-center justify-center text-2xl font-bold border-2 border-brand/20 shadow-xs">
              {iniciales}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800">
                {empleado.nombres} {empleado.apellidos}
              </h2>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">{empleado.cargo}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  empleado.estado === 'ACTIVO' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                }`}>
                  {empleado.estado}
                </span>
                <span className="text-xs text-neutral-400 font-mono">ID: {empleado.id}</span>
              </div>
            </div>
          </div>

          {/* Bloque de Acciones Críticas */}
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <Link href={`/admin/empleados/${empleado.id}/editar`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full" leftIcon={<Edit2 size={16} />}>
                Editar Datos
              </Button>
            </Link>
            
            <Button
              variant="outline"
              loading={actionLoading}
              onClick={handleToggleEstado}
              className={empleado.estado === 'ACTIVO' 
                ? 'w-full sm:w-auto hover:text-red-600 hover:bg-red-50 border-neutral-200' 
                : 'w-full sm:w-auto hover:text-green-600 hover:bg-green-50 border-neutral-200'
              }
              leftIcon={empleado.estado === 'ACTIVO' ? <UserX size={16} /> : <UserCheck size={16} />}
            >
              {empleado.estado === 'ACTIVO' ? 'Dar de Baja' : 'Reactivar'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Grid de Detalles Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Información de Identidad */}
        <Card>
          <CardBody className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
              <Fingerprint size={16} className="text-brand" />
              Datos de Identidad
            </h3>
            
            <div className="space-y-3 pt-1">
              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Código Único Institucional</span>
                <div className="text-sm font-mono font-bold text-neutral-800 bg-neutral-50 p-2 rounded-md border border-dashed flex items-center gap-2">
                  <Hash size={14} className="text-neutral-400" />
                  {empleado.codigo_unico}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Tipo de Documento</span>
                  <div className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                    <CreditCard size={15} className="text-neutral-400" />
                    {empleado.tipo_documento}
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Número de Documento</span>
                  <div className="text-sm font-mono font-semibold text-neutral-800">
                    {empleado.numero_documento}
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Contacto Electrónico</span>
                <div className="text-sm font-medium text-neutral-800 flex items-center gap-2 truncate">
                  <Mail size={15} className="text-neutral-400" />
                  {empleado.correo}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card: Estructura Organizacional */}
        <Card>
          <CardBody className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-brand" />
              Posición y Ubicación Laboral
            </h3>
            
            <div className="space-y-3 pt-1">
              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Área / Departamento</span>
                <div className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                  <Briefcase size={15} className="text-neutral-400" />
                  {empleado.area}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Sede Operativa</span>
                <div className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                  <MapPin size={15} className="text-neutral-400" />
                  {empleado.sede_nombre || 'Sede no especificada'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Fecha de Ingreso</span>
                  <div className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                    <Calendar size={15} className="text-neutral-400" />
                    {new Date(empleado.fecha_ingreso).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-0.5">Alta en Sistema</span>
                  <div className="text-sm font-medium text-neutral-500">
                    {new Date(empleado.fecha_creacion).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card: Historial de Horarios */}
        <AsignacionesEmpleado empleadoId={empleado.id} />

      </div>
    </div>
  );
}