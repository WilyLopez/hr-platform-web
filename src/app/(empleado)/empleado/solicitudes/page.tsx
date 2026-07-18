'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner, Badge, Modal, Input, Select } from "@/components/ui";
import { solicitudService } from "@/services/solicitud.service";
import { tipoPermisoService } from "@/services/tipoPermiso.service";
import { useToast } from "@/hooks/useToast";
import type { Solicitud, TipoPermiso } from "@/types/solicitud.types";
import { 
  Plus, 
  FileText,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function SolicitudesPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [tiposPermiso, setTiposPermiso] = useState<TipoPermiso[]>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo_permiso_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    motivo: "",
    adjunto_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const selectedTipo = tiposPermiso.find(t => t.id === parseInt(formData.tipo_permiso_id));
  const requiereAdjunto = selectedTipo?.requiere_adjunto || false;

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [sols, tipos] = await Promise.all([
        solicitudService.listar(),
        tipoPermisoService.listar()
      ]);
      setSolicitudes(sols.results || sols as any);
      setTiposPermiso(tipos);
    } catch (error) {
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await solicitudService.uploadAdjunto(file);
      setFormData(prev => ({ ...prev, adjunto_url: response.url }));
      toast.success("Archivo subido correctamente");
    } catch (error) {
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiereAdjunto && !formData.adjunto_url) {
      toast.error("Este tipo de permiso requiere adjuntar un documento");
      return;
    }

    setSubmitting(true);
    try {
      await solicitudService.crear({
        tipo_permiso_id: parseInt(formData.tipo_permiso_id),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        hora_inicio: formData.hora_inicio || null,
        hora_fin: formData.hora_fin || null,
        motivo: formData.motivo,
        adjunto_url: formData.adjunto_url || null,
      });
      toast.success("Solicitud enviada correctamente");
      setModalOpen(false);
      setFormData({
        tipo_permiso_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: "",
        motivo: "",
        adjunto_url: "",
      });
      cargarDatos();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Error al enviar la solicitud";
      toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setSubmitting(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch(estado) {
      case 'APROBADA':
        return <Badge variant="success" {...({ icon: <CheckCircle2 size={14} /> } as any)}>Aprobada</Badge>;
      case 'RECHAZADA':
        return <Badge variant="danger" {...({ icon: <XCircle size={14} /> } as any)}>Rechazada</Badge>;
      case 'PENDIENTE':
        return <Badge variant="warning" {...({ icon: <Clock size={14} /> } as any)}>Pendiente</Badge>;
      default:
        return <Badge variant="neutral">{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha + 'T12:00:00').toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Solicitudes"
        description="Gestiona tus permisos y vacaciones"
        action={
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Nueva Solicitud
          </Button>
        }
      />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <Spinner size="lg" />
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-neutral-500">
              <FileText size={48} className="text-neutral-300 mb-4" />
              <p className="text-lg font-medium text-neutral-600">No tienes solicitudes</p>
              <p className="text-sm">Tus solicitudes de permisos y vacaciones aparecerán aquí</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-4 font-semibold text-neutral-700">Tipo de Permiso</th>
                    <th className="p-4 font-semibold text-neutral-700">Fechas</th>
                    <th className="p-4 font-semibold text-neutral-700">Horas</th>
                    <th className="p-4 font-semibold text-neutral-700">Motivo</th>
                    <th className="p-4 font-semibold text-neutral-700">Estado</th>
                    <th className="p-4 font-semibold text-neutral-700">Evaluador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {solicitudes.map((sol) => (
                    <tr key={sol.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-4 font-medium text-neutral-800">
                        {sol.tipo_permiso_nombre}
                        {sol.dias_solicitados > 1 && (
                          <span className="ml-2 text-xs text-neutral-500 font-normal">
                            ({sol.dias_solicitados} días)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-600 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} className="text-neutral-400" />
                          {sol.fecha_inicio === sol.fecha_fin 
                            ? formatearFecha(sol.fecha_inicio)
                            : `${formatearFecha(sol.fecha_inicio)} - ${formatearFecha(sol.fecha_fin)}`}
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600 text-sm">
                        {sol.hora_inicio && sol.hora_fin ? (
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="text-neutral-400" />
                            {sol.hora_inicio.slice(0,5)} a {sol.hora_fin.slice(0,5)}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Día completo</span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-600 text-sm max-w-xs">
                        <div className="truncate" title={sol.motivo}>
                          {sol.motivo}
                        </div>
                        {sol.adjunto_url && (
                          <a href={sol.adjunto_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-1 text-xs text-brand-600 hover:underline">
                            <FileText size={12} />
                            Ver adjunto
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        {getEstadoBadge(sol.estado)}
                      </td>
                      <td className="p-4 text-neutral-600 text-sm">
                        {sol.estado !== 'PENDIENTE' && (
                          <div className="flex flex-col">
                            <span>{new Date(sol.fecha_evaluacion || '').toLocaleDateString()}</span>
                            {sol.comentario_evaluador && (
                              <span className="text-xs italic text-neutral-500 mt-1" title={sol.comentario_evaluador}>
                                "{sol.comentario_evaluador}"
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        title="Solicitar Permiso o Vacaciones"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo de Permiso"
            value={formData.tipo_permiso_id}
            onChange={(e) => setFormData({ ...formData, tipo_permiso_id: e.target.value })}
            required
            disabled={submitting}
            placeholder="Seleccione un tipo"
            options={tiposPermiso.map(t => ({ value: t.id, label: t.nombre }))}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha Inicio"
              value={formData.fecha_inicio}
              onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              type="date"
              label="Fecha Fin"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
            <div className="flex gap-2 items-start text-brand-700 mb-3">
              <AlertCircle size={18} className="mt-0.5" />
              <div>
                <p className="font-medium text-sm">¿Es un permiso parcial?</p>
                <p className="text-xs opacity-90">Si necesitas ausentarte solo unas horas, indícalo abajo. Si es todo el día, déjalo en blanco.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                label="Hora Inicio (Opcional)"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                disabled={submitting}
              />
              <Input
                type="time"
                label="Hora Fin (Opcional)"
                value={formData.hora_fin}
                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>

          {requiereAdjunto && (
            <div className="flex flex-col gap-1.5 p-4 border border-dashed border-neutral-300 rounded-xl bg-neutral-50/50">
              <label className="text-sm font-semibold text-neutral-700">Archivo Adjunto Requerido</label>
              <p className="text-xs text-neutral-500 mb-2">Este tipo de permiso requiere un justificante o documento de respaldo.</p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={submitting || uploading}
                  className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                  required={!formData.adjunto_url}
                />
                {uploading && <Spinner size="sm" />}
              </div>
              {formData.adjunto_url && !uploading && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 size={14} /> Archivo listo para enviar
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-700">Motivo detallado</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand resize-none"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              required
              rows={3}
              placeholder="Explica brevemente el motivo de tu solicitud..."
              disabled={submitting}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formData.tipo_permiso_id}
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
