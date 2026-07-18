'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Skeleton, Badge } from "@/components/ui";
import { notificacionService } from "@/services/notificacion.service";
import { useToast } from "@/hooks/useToast";
import { useNotificacionStore } from "@/store/notificacion.store";
import type { Notificacion } from "@/types/notificacion.types";
import { Bell, BellOff, CheckCheck, Inbox } from "lucide-react";

function formatFecha(fechaStr: string): string {
  const fecha = new Date(fechaStr);
  const ahora = new Date();
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffHrs / 24);
  if (diffMin < 1) return "Ahora mismo";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  if (diffDias === 1) return "Ayer";
  return fecha.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export default function NotificacionesPage() {
  const toast = useToast();
  const decrementarNoLeidas = useNotificacionStore((s) => s.decrementar);
  const setNoLeidas = useNotificacionStore((s) => s.setNoLeidas);

  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const resp = await notificacionService.listar();
      setNotificaciones(resp.results || []);
      setNoLeidas(resp.no_leidas);
    } catch {
      toast.error("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleMarcarLeida = async (notif: Notificacion) => {
    if (notif.leida) return;
    setMarkingId(notif.id);
    try {
      await notificacionService.marcarLeida(notif.id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, leida: true } : n))
      );
      decrementarNoLeidas();
    } catch {
      toast.error("No se pudo marcar como leída.");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    const noLeidas = notificaciones.filter((n) => !n.leida);
    if (noLeidas.length === 0) return;
    try {
      await Promise.all(noLeidas.map((n) => notificacionService.marcarLeida(n.id)));
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setNoLeidas(0);
      toast.success("Todas las notificaciones marcadas como leídas.");
    } catch {
      toast.error("Error al marcar todas como leídas.");
    }
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificaciones"
        description="Tus alertas y mensajes del sistema"
        action={
          noLeidas > 0 ? (
            <button
              onClick={handleMarcarTodasLeidas}
              className="flex items-center gap-2 text-sm text-brand font-medium hover:underline"
            >
              <CheckCheck size={16} />
              Marcar todas como leídas
            </button>
          ) : undefined
        }
      />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="divide-y divide-neutral-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4 animate-pulse">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
              <Inbox size={48} className="text-neutral-200" />
              <p className="font-medium text-neutral-500">Sin notificaciones</p>
              <p className="text-sm">Cuando recibas alertas del sistema aparecerán aquí.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notificaciones.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleMarcarLeida(notif)}
                  disabled={notif.leida || markingId === notif.id}
                  className={`w-full text-left flex items-start gap-4 p-4 transition-colors
                    ${notif.leida
                      ? "bg-white hover:bg-neutral-50/50"
                      : "bg-brand-pale/40 hover:bg-brand-pale/70"
                    }`}
                >
                  {/* Icono */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${notif.leida ? "bg-neutral-100 text-neutral-400" : "bg-brand/10 text-brand"}`}
                  >
                    {notif.leida ? <BellOff size={18} /> : <Bell size={18} />}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-tight ${notif.leida ? "text-neutral-600" : "text-neutral-900"}`}>
                        {notif.titulo}
                      </p>
                      {!notif.leida && (
                        <span className="w-2 h-2 bg-brand rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mt-0.5 line-clamp-2">{notif.mensaje}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-neutral-400">
                        {notif.fecha_envio ? formatFecha(notif.fecha_envio) : formatFecha(notif.fecha_creacion)}
                      </span>
                      <Badge variant={notif.leida ? "neutral" : "brand"} className="text-xs px-1.5 py-0">
                        {notif.canal}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
