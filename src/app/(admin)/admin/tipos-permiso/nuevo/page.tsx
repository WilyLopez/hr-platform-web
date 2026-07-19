'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button } from "@/components/ui";
import { tipoPermisoService } from "@/services/tipo-permiso.service";
import { useToast } from "@/hooks/useToast";
import type { CrearTipoPermisoInput } from "@/types/solicitud.types";
import { ArrowLeft, Save, Heading, AlignLeft } from "lucide-react";
import Link from 'next/link';

export default function NuevoTipoPermisoPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requiereAdjunto, setRequiereAdjunto] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica local antes del envío
    if (!nombre.trim()) {
      toast.error("El nombre de la categoría es obligatorio.");
      return;
    }

    setLoading(true);

    const payload: CrearTipoPermisoInput = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      requiere_adjunto: requiereAdjunto
    };

    try {
      await tipoPermisoService.crear(payload);
      toast.success("Tipo de permiso creado exitosamente.");
      
      // Redirección y refresco de la ruta para pintar el nuevo registro
      router.push('/admin/tipos-permiso');
      router.refresh();
    } catch (error) {
      toast.error("Hubo un error al crear el tipo de permiso. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Nuevo Tipo de Permiso"
        description="Configura una nueva regla o categoría de ausencia para la organización"
        action={
          <Link href="/admin/tipos-permiso">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver
            </Button>
          </Link>
        }
      />

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre del Tipo de Permiso */}
            <div>
              <label htmlFor="nombre" className="form-label">
                Nombre del Permiso
              </label>
              <div className="relative">
                <Heading className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="nombre"
                  type="text"
                  required
                  placeholder="Ej: Licencia por Paternidad, Permiso Médico, Vacaciones"
                  className="form-input pl-10"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Asigna un nombre claro y directo que los empleados reconozcan fácilmente en la app móvil.
              </p>
            </div>

            {/* Descripción detallada */}
            <div>
              <label htmlFor="descripcion" className="form-label">
                Descripción / Detalles de la Regla
              </label>
              <div className="relative flex items-start">
                <AlignLeft className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <textarea
                  id="descripcion"
                  required
                  rows={4}
                  placeholder="Ej: Permiso con goce de haber otorgado en caso de citas médicas debidamente justificadas..."
                  className="form-input pl-10 resize-none"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Describe detalladamente los lineamientos o políticas asociadas a este tipo de ausencia.
              </p>
            </div>

            {/* Configuración de Adjunto Obligatorio */}
            <div className="bg-neutral-50 dark:bg-slate-800/60 p-4 rounded-xl border border-neutral-200/60 dark:border-slate-700 flex items-start gap-3">
              <div className="flex h-5 items-center">
                <input
                  id="requiere_adjunto"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 dark:border-slate-600 text-brand focus:ring-brand cursor-pointer"
                  checked={requiereAdjunto}
                  onChange={(e) => setRequiereAdjunto(e.target.checked)}
                />
              </div>
              <div className="text-sm">
                <label htmlFor="requiere_adjunto" className="font-semibold text-foreground cursor-pointer select-none">
                  Requiere Sustento / Adjunto Obligatorio
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Al activar esto, el sistema obligará al colaborador a subir un archivo digital (constancia, certificado, receta, etc.) para poder enviar la solicitud de permiso.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-slate-800">
              <Link href="/admin/tipos-permiso">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" variant="brand" loading={loading} leftIcon={<Save size={18} />}>
                Crear Categoría
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
}