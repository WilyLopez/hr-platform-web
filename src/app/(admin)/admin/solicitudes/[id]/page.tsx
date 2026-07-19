'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { solicitudService } from "@/services/solicitud.service";
import { useToast } from "@/hooks/useToast";
import type { Solicitud } from "@/types/solicitud.types";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  FileText, 
  Paperclip, 
  User, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import Link from 'next/link';

export default function DetalleSolicitudPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const router = useRouter();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);

  // Estados para el Modal de Evaluación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'APROBAR' | 'RECHAZAR' | null>(null);
  const [comentario, setComentario] = useState('');
  const [processing, setProcessing] = useState(false);

  const cargarSolicitud = async () => {
    setLoading(true);
    try {
      const data = await solicitudService.obtener(id);
      setSolicitud(data);
    } catch (error) {
      toast.error("No se pudo cargar el detalle de la solicitud.");
      router.push('/admin/solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarSolicitud();
    }
  }, [id]);

  // Manejo de apertura del modal
  const handleOpenEvaluation = (type: 'APROBAR' | 'RECHAZAR') => {
    setActionType(type);
    setComentario('');
    setIsModalOpen(true);
  };

  // Ejecución de la acción hacia el backend
  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solicitud || !actionType) return;

    // Validación opcional: Forzar comentario si se rechaza
    if (actionType === 'RECHAZAR' && !comentario.trim()) {
      toast.error("Debes ingresar un motivo o comentario para rechazar la solicitud.");
      return;
    }

    setProcessing(true);
    try {
      if (actionType === 'APROBAR') {
        await solicitudService.aprobar(id, { comentario: comentario.trim() || null });
        toast.success("La solicitud ha sido APROBADA exitosamente.");
      } else {
        await solicitudService.rechazar(id, { comentario: comentario.trim() || null });
        toast.success("La solicitud ha sido RECHAZADA.");
      }
      
      setIsModalOpen(false);
      cargarSolicitud(); // Recargar la data para ver el nuevo estado
      router.refresh();
    } catch (error) {
      toast.error(`Ocurrió un error al intentar ${actionType.toLowerCase()} la solicitud.`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-brand" />
        <p className="mt-4 text-xs text-muted-foreground font-medium">Cargando expediente de la solicitud...</p>
      </div>
    );
  }

  if (!solicitud) return null;

  // Helpers visuales
  const esPendiente = solicitud.estado === 'PENDIENTE' || solicitud.estado === 'EN_REVISION';
  const formatearFecha = (stringIso: string) => new Date(stringIso).toLocaleDateString();
  const formatearFechaHora = (stringIso: string) => {
    const d = new Date(stringIso);
    return `${d.toLocaleDateString()} a las ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <PageHeader
        title={`Solicitud #${solicitud.id}`}
        description="Revisión detallada de permiso laboral"
        action={
          <Link href="/admin/solicitudes">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Volver a la Bandeja
            </Button>
          </Link>
        }
      />

      {/* Tarjeta Principal: Estado y Acciones Rápidas */}
      <Card className={
        solicitud.estado === 'APROBADA' ? 'border-t-4 border-t-green-500' :
        solicitud.estado === 'RECHAZADA' ? 'border-t-4 border-t-red-500' :
        'border-t-4 border-t-amber-500'
      }>
        <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6">
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-1">ESTADO ACTUAL</p>
            <h2 className={`text-2xl font-black tracking-tight ${
              solicitud.estado === 'APROBADA' ? 'text-green-600 dark:text-green-400' :
              solicitud.estado === 'RECHAZADA' ? 'text-red-600 dark:text-red-400' :
              solicitud.estado === 'CANCELADA' ? 'text-muted-foreground' :
              'text-amber-600 dark:text-amber-400'
            }`}>
              {solicitud.estado.replace('_', ' ')}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Registrada el {formatearFechaHora(solicitud.fecha_creacion)}
            </p>
          </div>

          {/* Botonera de Decisión (Solo visible si está pendiente) */}
          {esPendiente && (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400"
                leftIcon={<XCircle size={18} />}
                onClick={() => handleOpenEvaluation('RECHAZAR')}
              >
                Rechazar
              </Button>
              <Button
                variant="success"
                className="w-full sm:w-auto"
                leftIcon={<CheckCircle size={18} />}
                onClick={() => handleOpenEvaluation('APROBAR')}
              >
                Aprobar Permiso
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Detalles del Permiso */}
        <div className="space-y-6">
          <Card>
            <CardBody className="space-y-5">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <FileText size={16} className="text-brand" />
                Detalles del Requerimiento
              </h3>
              
              <div>
                <span className="block text-xs font-semibold text-muted-foreground mb-1">Colaborador</span>
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  {solicitud.empleado_nombre}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-muted-foreground mb-1">Tipo de Ausencia</span>
                <div className="text-sm font-medium text-neutral-700 dark:text-slate-300 bg-neutral-50 dark:bg-slate-800/60 px-3 py-2 rounded-md border border-border">
                  {solicitud.tipo_permiso_nombre}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground mb-1">Período</span>
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar size={15} className="text-muted-foreground" />
                    {formatearFecha(solicitud.fecha_inicio)} al {formatearFecha(solicitud.fecha_fin)}
                  </div>
                  {solicitud.hora_inicio && solicitud.hora_fin && (
                    <div className="text-sm font-medium text-indigo-600 flex items-center gap-2 mt-2">
                      <Clock size={15} />
                      {solicitud.hora_inicio.slice(0,5)} a {solicitud.hora_fin.slice(0,5)}
                    </div>
                  )}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground mb-1">Duración</span>
                  <div className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Clock size={15} className="text-muted-foreground" />
                    {solicitud.dias_solicitados} día(s)
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tarjeta del Evaluador (Si ya fue evaluada) */}
          {!esPendiente && solicitud.estado !== 'CANCELADA' && (
            <Card className="bg-neutral-50/50 dark:bg-slate-800/30">
              <CardBody className="space-y-4">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-brand dark:text-brand-light" />
                  Resolución
                </h3>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground mb-1">Evaluado por ID: {solicitud.evaluado_por_id}</span>
                  <div className="text-xs text-muted-foreground mb-3">
                    Fecha de decisión: {solicitud.fecha_evaluacion ? formatearFechaHora(solicitud.fecha_evaluacion) : 'N/A'}
                  </div>
                  <div className="text-sm text-neutral-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border border-border italic">
                    {solicitud.comentario_evaluador || 'Sin comentarios adicionales por parte del evaluador.'}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Columna Derecha: Sustento y Adjuntos */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardBody className="space-y-5">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-brand dark:text-brand-light" />
                Sustento / Motivo
              </h3>

              <div>
                <p className="text-sm text-neutral-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {solicitud.motivo}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-slate-800">
                <span className="block text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Paperclip size={14} />
                  Documentos Adjuntos
                </span>

                {solicitud.adjunto_url ? (
                  <a
                    href={solicitud.adjunto_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-slate-700 hover:bg-brand-pale dark:hover:bg-brand/10 hover:border-brand-dark dark:hover:border-brand-light transition-colors group"
                  >
                    <div className="p-2 bg-neutral-100 dark:bg-slate-800 rounded text-neutral-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-brand dark:group-hover:text-brand-light">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-brand dark:group-hover:text-brand-light">Ver documento adjunto</p>
                      <p className="text-xs text-muted-foreground">Abre en una nueva pestaña</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-slate-800/60 rounded-lg border border-dashed border-neutral-200 dark:border-slate-700 text-center">
                    <FileText size={24} className="text-neutral-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">El colaborador no adjuntó archivos</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

      {/* MODAL DE EVALUACIÓN (Aprobar / Rechazar) */}
      {isModalOpen && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${actionType === 'APROBAR' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/40 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/40 text-red-800 dark:text-red-300'}`}>
              {actionType === 'APROBAR' ? <CheckCircle size={20} className="text-green-600 dark:text-green-400" /> : <XCircle size={20} className="text-red-600 dark:text-red-400" />}
              <h4 className="text-base font-bold">
                {actionType === 'APROBAR' ? 'Confirmar Aprobación' : 'Rechazar Solicitud'}
              </h4>
            </div>

            <form onSubmit={handleConfirmAction} className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                {actionType === 'APROBAR'
                  ? `Estás a punto de aprobar el permiso de ${solicitud.dias_solicitados} días para ${solicitud.empleado_nombre}.`
                  : `Vas a rechazar la solicitud de ${solicitud.empleado_nombre}.`
                }
              </p>

              <div>
                <label className="form-label">
                  Comentario / Observación {actionType === 'RECHAZAR' && <span className="text-danger">*</span>}
                </label>
                <textarea
                  rows={3}
                  className="form-input resize-none"
                  placeholder={actionType === 'APROBAR' ? "Ej: Aprobado. Coordinar entregables pendientes." : "Especifica el motivo del rechazo..."}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required={actionType === 'RECHAZAR'}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={processing}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant={actionType === 'APROBAR' ? 'success' : 'danger'}
                  size="sm"
                  loading={processing}
                >
                  {actionType === 'APROBAR' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}