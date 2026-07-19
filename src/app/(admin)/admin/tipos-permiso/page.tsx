'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { tipoPermisoService } from "@/services/tipo-permiso.service";
import { useToast } from "@/hooks/useToast";
import type { TipoPermiso, CrearTipoPermisoInput } from "@/types/solicitud.types";
import { 
  Plus, 
  Search, 
  FileText, 
  Check, 
  X, 
  Edit2, 
  AlertCircle 
} from "lucide-react";
import Link from 'next/link';

export default function TiposPermisoPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState<TipoPermiso[]>([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para el Modal de Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requiereAdjunto, setRequiereAdjunto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar lista de tipos de permiso
  const cargarTipos = async () => {
    setLoading(true);
    try {
      const data = await tipoPermisoService.listar();
      setTipos(data);
    } catch (error) {
      toast.error("Error al cargar los tipos de permiso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  // Abrir modal con los datos del tipo seleccionado
  const handleOpenEditModal = (tipo: TipoPermiso) => {
    setEditingId(tipo.id);
    setNombre(tipo.nombre);
    setDescripcion(tipo.descripcion);
    setRequiereAdjunto(tipo.requiere_adjunto);
    setIsModalOpen(true);
  };

  // Guardar cambios de la edición
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    const payload: CrearTipoPermisoInput = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      requiere_adjunto: requiereAdjunto
    };

    try {
      await tipoPermisoService.actualizar(editingId, payload);
      toast.success("Tipo de permiso actualizado con éxito.");
      setIsModalOpen(false);
      cargarTipos(); // Recargar la lista
    } catch (error) {
      toast.error("No se pudo actualizar el tipo de permiso.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrado por coincidencia en nombre o descripción
  const tiposFiltrados = tipos.filter(tipo => 
    tipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    tipo.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tipos de Permiso"
        description="Gestiona las categorías de licencias y ausencias disponibles en la empresa"
        action={
          <Link href="/admin/tipos-permiso/nuevo">
            <Button variant="brand" leftIcon={<Plus size={18} />}>
              Nuevo Tipo
            </Button>
          </Link>
        }
      />

      {/* Barra de Búsqueda */}
      <Card>
        <CardBody className="flex items-center justify-between gap-4 py-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar tipo o descripción..."
              className="form-input pl-10"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Total: {tiposFiltrados.length} configurados
          </div>
        </CardBody>
      </Card>

      {/* Tabla de Gestión */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-slate-800/60 border-b border-neutral-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-sm">Nombre</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-sm">Descripción</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-sm text-center">Requiere Adjunto</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-sm text-center">Estado</th>
                <th className="p-4 font-semibold text-neutral-500 dark:text-slate-400 text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Spinner size="md" className="mx-auto" />
                    <p className="mt-2 text-xs text-muted-foreground">Cargando categorías...</p>
                  </td>
                </tr>
              ) : tiposFiltrados.length > 0 ? (
                tiposFiltrados.map((tipo) => (
                  <tr key={tipo.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-foreground text-sm">{tipo.nombre}</td>
                    <td className="p-4 text-neutral-600 dark:text-slate-300 text-sm max-w-xs truncate">{tipo.descripcion}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tipo.requiere_adjunto
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                          : 'bg-neutral-50 dark:bg-slate-800 text-neutral-600 dark:text-slate-400 border border-neutral-200 dark:border-slate-700'
                      }`}>
                        {tipo.requiere_adjunto ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        tipo.es_activo
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40'
                      }`}>
                        {tipo.es_activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(tipo)}
                        leftIcon={<Edit2 size={13} />}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                    No se encontraron tipos de permiso registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Quick Edit (Renderizado Condicional) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-xl border border-border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-slate-800 bg-neutral-50 dark:bg-slate-800/60">
              <h4 className="text-sm font-bold text-foreground">Modificar Tipo de Permiso</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  required
                  rows={3}
                  className="form-input resize-none"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-slate-800/60 p-3 rounded-lg border border-border">
                <input
                    id="modal_requiere_adjunto"
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 dark:border-slate-600 text-brand focus:ring-brand cursor-pointer"
                    checked={requiereAdjunto}
                    onChange={(e) => setRequiereAdjunto(e.target.checked)} // <-- Cambiar aquí
                    />
                <label htmlFor="modal_requiere_adjunto" className="text-xs font-medium text-foreground cursor-pointer select-none">
                  Obligar al empleado a subir un documento justificativo (adjunto)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button type="submit" variant="brand" size="sm" loading={submitting}>
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}