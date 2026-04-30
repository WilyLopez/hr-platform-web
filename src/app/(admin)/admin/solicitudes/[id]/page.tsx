"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Card, CardBody, CardHeader, Badge, Button, Modal } from "@/components/ui";
import { solicitudService } from "@/services/solicitud.service";
import { formatDate, formatDateTime } from "@/utils/format";
import { ESTADOS_SOLICITUD } from "@/utils/constants";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rechazarSolicitudSchema } from "@/lib/schemas/solicitud.schema";
import { Check, X, ArrowLeft } from "lucide-react";

export default function SolicitudDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const solicitudId = parseInt(id, 10);
  const router  = useRouter();
  const toast   = useToast();
  const qc      = useQueryClient();
  const [modalRechazar, setModalRechazar] = useState(false);

  const { data: solicitud, isLoading } = useQuery({
    queryKey: ["solicitudes", solicitudId],
    queryFn:  () => solicitudService.obtener(solicitudId),
  });

  const { mutate: aprobar, isPending: aprobando } = useMutation({
    mutationFn: () => solicitudService.aprobar(solicitudId, { comentario: null }),
    onSuccess:  () => { toast.success("Solicitud aprobada."); qc.invalidateQueries({ queryKey: ["solicitudes"] }); router.back(); },
    onError:    () => toast.error("No se pudo aprobar la solicitud."),
  });

  const { mutate: rechazar, isPending: rechazando } = useMutation({
    mutationFn: (comentario: string) => solicitudService.rechazar(solicitudId, { comentario }),
    onSuccess:  () => { toast.success("Solicitud rechazada."); qc.invalidateQueries({ queryKey: ["solicitudes"] }); router.back(); },
    onError:    () => toast.error("No se pudo rechazar la solicitud."),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<{ comentario: string }>({
    resolver: zodResolver(rechazarSolicitudSchema),
  });

  if (isLoading || !solicitud) return null;

  const estado  = ESTADOS_SOLICITUD[solicitud.estado];
  const puedeEvaluar = solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION";

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Detalle de solicitud"
        action={
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => router.back()}>
            Volver
          </Button>
        }
      />

      <Card>
        <CardHeader
          title={solicitud.tipo_permiso_nombre}
          action={<Badge variant={estado.variant as "warning"} dot>{estado.label}</Badge>}
        />
        <CardBody>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-neutral-500">Empleado</dt><dd className="font-medium mt-0.5">{solicitud.empleado_nombre}</dd></div>
            <div><dt className="text-neutral-500">Días solicitados</dt><dd className="font-medium mt-0.5">{solicitud.dias_solicitados} día{solicitud.dias_solicitados !== 1 ? "s" : ""}</dd></div>
            <div><dt className="text-neutral-500">Fecha inicio</dt><dd className="font-medium mt-0.5">{formatDate(solicitud.fecha_inicio)}</dd></div>
            <div><dt className="text-neutral-500">Fecha fin</dt><dd className="font-medium mt-0.5">{formatDate(solicitud.fecha_fin)}</dd></div>
            <div className="col-span-2"><dt className="text-neutral-500">Motivo</dt><dd className="mt-0.5 text-neutral-700">{solicitud.motivo}</dd></div>
            {solicitud.comentario_evaluador && (
              <div className="col-span-2"><dt className="text-neutral-500">Comentario del evaluador</dt><dd className="mt-0.5 text-neutral-700">{solicitud.comentario_evaluador}</dd></div>
            )}
            <div><dt className="text-neutral-500">Creada</dt><dd className="font-medium mt-0.5">{formatDateTime(solicitud.fecha_creacion)}</dd></div>
          </dl>
        </CardBody>
      </Card>

      {puedeEvaluar && (
        <div className="flex gap-3">
          <Button
            variant="danger"
            leftIcon={<X size={15} />}
            onClick={() => setModalRechazar(true)}
          >
            Rechazar
          </Button>
          <Button
            leftIcon={<Check size={15} />}
            loading={aprobando}
            onClick={() => aprobar()}
          >
            Aprobar solicitud
          </Button>
        </div>
      )}

      <Modal open={modalRechazar} onClose={() => setModalRechazar(false)} title="Rechazar solicitud" size="sm">
        <form onSubmit={handleSubmit((d) => rechazar(d.comentario))} className="space-y-4">
          <div>
            <label className="form-label">Motivo del rechazo <span className="text-danger">*</span></label>
            <textarea
              className="form-input resize-none h-24"
              placeholder="Explica el motivo del rechazo..."
              {...register("comentario")}
            />
            {errors.comentario && <p className="form-error">{errors.comentario.message}</p>}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModalRechazar(false)}>Cancelar</Button>
            <Button type="submit" variant="danger" fullWidth loading={rechazando}>Rechazar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}