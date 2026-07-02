'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { empleadoService } from "@/services/empleado.service";
import { useToast } from "@/hooks/useToast";
import type { ActualizarEmpleadoInput } from "@/types/empleado.types";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Briefcase, 
  Lock
} from "lucide-react";
import Link from 'next/link';

export default function EditarEmpleadoPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const router = useRouter();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Campos editables (coinciden exactamente con ActualizarEmpleadoInput)
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [cargo, setCargo] = useState('');
  const [area, setArea] = useState('');

  // Estado adicional para mostrar datos de contexto (no editables)
  const [contexto, setContexto] = useState<{ codigo: string; documento: string } | null>(null);

  useEffect(() => {
    const cargarDatosEmpleado = async () => {
      try {
        const emp = await empleadoService.obtener(id);
        
        // Poblamos los campos del formulario editable
        setNombres(emp.nombres);
        setApellidos(emp.apellidos);
        setCorreo(emp.correo);
        setCargo(emp.cargo);
        setArea(emp.area);
        
        // Guardamos los datos de sólo lectura para el contexto visual
        setContexto({
          codigo: emp.codigo_unico,
          documento: `${emp.tipo_documento}: ${emp.numero_documento}`
        });
      } catch (error) {
        toast.error("No se pudo recuperar la información del colaborador.");
        router.push('/admin/empleados');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarDatosEmpleado();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo.trim() || !nombres.trim() || !apellidos.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setSubmitting(true);

    // Construcción estricta del payload basado en ActualizarEmpleadoInput
    const payload: ActualizarEmpleadoInput = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim(),
      cargo: cargo.trim(),
      area: area.trim()
    };

    try {
      await empleadoService.actualizar(id, payload);
      toast.success("Información actualizada correctamente.");
      
      // Redirección directa al perfil del empleado y refresco de datos
      router.push(`/admin/empleados/${id}`);
      router.refresh();
    } catch (error) {
      toast.error("Hubo un error al actualizar los datos. Verifica el formato del correo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-brand" />
        <p className="mt-4 text-xs text-neutral-500 font-medium">Cargando formulario de edición...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Modificar Colaborador"
        description={`Editando el expediente laboral de ${nombres} ${apellidos}`}
        action={
          <Link href={`/admin/empleados/${id}`}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Cancelar
            </Button>
          </Link>
        }
      />

      {/* Bloque Informativo de Datos Inmutables */}
      {contexto && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-100 p-4 rounded-xl border border-neutral-200/60 text-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <Lock size={14} className="text-neutral-400 shrink-0" />
            <span>Código Institucional (Fijo): <strong className="font-mono text-neutral-700">{contexto.codigo}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 sm:justify-end">
            <Lock size={14} className="text-neutral-400 shrink-0" />
            <span>Identificación oficial: <strong className="text-neutral-700">{contexto.documento}</strong></span>
          </div>
        </div>
      )}

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Fila: Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit_nombres" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombres
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    id="edit_nombres"
                    type="text"
                    required
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit_apellidos" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Apellidos
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    id="edit_apellidos"
                    type="text"
                    required
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Campo: Correo Electrónico */}
            <div>
              <label htmlFor="edit_correo" className="block text-xs font-semibold text-neutral-700 mb-1">
                Correo Electrónico Laboral
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  id="edit_correo"
                  type="email"
                  required
                  className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            {/* Fila: Área y Cargo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit_area" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Área / Departamento
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    id="edit_area"
                    type="text"
                    required
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit_cargo" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Cargo / Puesto Operativo
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    id="edit_cargo"
                    type="text"
                    required
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Botonera de Envío */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <Link href={`/admin/empleados/${id}`}>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="brand" loading={submitting} leftIcon={<Save size={16} />}>
                Guardar Cambios
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
}