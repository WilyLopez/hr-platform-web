"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, Badge } from "@/components/ui";
import { EmptyState }  from "@/components/feedback/EmptyState";
import { notificacionService } from "@/services/notificacion.service";
import { useNotificacionStore } from "@/store/notificacion.store";
import { formatRelative } from "@/utils/format";
import { Bell } from "lucide-react";
import { cn } from "@/utils/cn";

export default function NotificacionesPage() {
  const qc          = useQueryClient();
  const setNoLeidas = useNotificacionStore((s) => s.setNoLeidas);

  const { data, isLoading } = useQuery({
    queryKey: ["notificaciones"],
    queryFn:  () => notificacionService.listar(),
  });

  const { mutate: marcarLeida } = useMutation({
    mutationFn: (id: number) => notificacionService.marcarLeida(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notificaciones"] });
      if (data) setNoLeidas(Math.max(0, data.no_leidas - 1));
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Notificaciones"
        action={data?.no_leidas ? (
          <Badge variant="danger">{data.no_leidas} sin leer</Badge>
        ) : undefined}
      />

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-neutral-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.results.length === 0 ? (
            <EmptyState icon={Bell} title="Sin notificaciones" description="Estás al día con todo." />
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-slate-800">
              {data?.results.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.leida && marcarLeida(n.id)}
                  className={cn(
                    "flex gap-3 px-5 py-4 transition-colors",
                    !n.leida ? "bg-brand-pale/40 dark:bg-brand/10 cursor-pointer hover:bg-brand-pale/70 dark:hover:bg-brand/20" : "bg-card"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                    n.leida ? "bg-neutral-200 dark:bg-slate-600" : "bg-brand dark:bg-brand-light"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !n.leida ? "font-semibold text-foreground" : "text-neutral-700 dark:text-slate-300")}>
                      {n.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.mensaje}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelative(n.fecha_creacion)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}