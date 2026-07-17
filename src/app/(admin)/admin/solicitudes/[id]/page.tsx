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
        <p className="mt-4 text-xs text-neutral-500 font-medium">Cargando expediente de la solicitud...</p>
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
            <p className="text-xs text-neutral-500 font-semibold mb-1">ESTADO ACTUAL</p>
            <h2 className={`text-2xl font-black tracking-tight ${
              solicitud.estado === 'APROBADA' ? 'text-green-600' :
              solicitud.estado === 'RECHAZADA' ? 'text-red-600' :
              solicitud.estado === 'CANCELADA' ? 'text-neutral-500' :
              'text-amber-600'
            }`}>
              {solicitud.estado.replace('_', ' ')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Registrada el {formatearFechaHora(solicitud.fecha_creacion)}
            </p>
          </div>

          {/* Botonera de Decisión (Solo visible si está pendiente) */}
          {esPendiente && (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
                leftIcon={<XCircle size={18} />}
                onClick={() => handleOpenEvaluation('RECHAZAR')}
              >
                Rechazar
              </Button>
              <Button 
                variant="brand" 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-green-500"
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
              <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
                <FileText size={16} className="text-brand" />
                Detalles del Requerimiento
              </h3>
              
              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-1">Colaborador</span>
                <div className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <User size={16} className="text-neutral-400" />
                  {solicitud.empleado_nombre}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-1">Tipo de Ausencia</span>
                <div className="text-sm font-medium text-neutral-700 bg-neutral-50 px-3 py-2 rounded-md border">
                  {solicitud.tipo_permiso_nombre}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-1">Período</span>
                  <div className="text-sm font-medium text-neutral-800 flex items-center gap-2">
                    <Calendar size={15} className="text-neutral-400" />
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
                  <span className="block text-xs font-semibold text-neutral-400 mb-1">Duración</span>
                  <div className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <Clock size={15} className="text-neutral-400" />
                    {solicitud.dias_solicitados} día(s)
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tarjeta del Evaluador (Si ya fue evaluada) */}
          {!esPendiente && solicitud.estado !== 'CANCELADA' && (
            <Card className="bg-neutral-50/50">
              <CardBody className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-brand" />
                  Resolución
                </h3>
                <div>
                  <span className="block text-xs font-semibold text-neutral-400 mb-1">Evaluado por ID: {solicitud.evaluado_por_id}</span>
                  <div className="text-xs text-neutral-500 mb-3">
                    Fecha de decisión: {solicitud.fecha_evaluacion ? formatearFechaHora(solicitud.fecha_evaluacion) : 'N/A'}
                  </div>
                  <div className="text-sm text-neutral-700 bg-white p-3 rounded border italic">
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
              <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-brand" />
                Sustento / Motivo
              </h3>
              
              <div>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {solicitud.motivo}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <span className="block text-xs font-semibold text-neutral-400 mb-3 flex items-center gap-2">
                  <Paperclip size={14} />
                  Documentos Adjuntos
                </span>
                
                {solicitud.adjunto_url ? (
                  <a 
                    href={solicitud.adjunto_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-brand-pale hover:border-brand-dark transition-colors group"
                  >
                    <div className="p-2 bg-neutral-100 rounded text-neutral-500 group-hover:bg-white group-hover:text-brand">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800 group-hover:text-brand">Ver documento adjunto</p>
                      <p className="text-xs text-neutral-500">Abre en una nueva pestaña</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg border border-dashed border-neutral-200 text-center">
                    <FileText size={24} className="text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-500 font-medium">El colaborador no adjuntó archivos</p>
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
          <div className="bg-white rounded-xl shadow-2xl border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
            <div className={`flex items-center gap-3 px-5 py-4 border-b ${actionType === 'APROBAR' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
              {actionType === 'APROBAR' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
              <h4 className="text-base font-bold">
                {actionType === 'APROBAR' ? 'Confirmar Aprobación' : 'Rechazar Solicitud'}
              </h4>
            </div>
            
            <form onSubmit={handleConfirmAction} className="p-5 space-y-4">
              <p className="text-sm text-neutral-600">
                {actionType === 'APROBAR' 
                  ? `Estás a punto de aprobar el permiso de ${solicitud.dias_solicitados} días para ${solicitud.empleado_nombre}.`
                  : `Vas a rechazar la solicitud de ${solicitud.empleado_nombre}.`
                }
              </p>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Comentario / Observación {actionType === 'RECHAZAR' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-brand resize-none"
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
                  variant="brand" 
                  size="sm" 
                  loading={processing}
                  className={actionType === 'APROBAR' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 border-red-600 text-white'}
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