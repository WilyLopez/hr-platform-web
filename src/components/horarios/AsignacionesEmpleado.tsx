"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { horarioService } from "@/services/horario.service";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { Clock, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import type { AsignacionHorario, Horario } from "@/types/horario.types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";

interface Props {
  empleadoId: number;
}

export function AsignacionesEmpleado({ empleadoId }: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: asignaciones, isLoading } = useQuery({
    queryKey: ["asignaciones-empleado", empleadoId],
    queryFn: () => horarioService.listarAsignacionesEmpleado(empleadoId),
    enabled: !!empleadoId
  });

  const { data: horarios } = useQuery({
    queryKey: ["horarios"],
    queryFn: () => horarioService.listar(),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      horario_id: "",
      fecha_desde: new Date().toISOString().split("T")[0]
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => horarioService.asignar({
      empleado_id: empleadoId,
      horario_id: Number(data.horario_id),
      fecha_desde: data.fecha_desde
    }),
    onSuccess: () => {
      toast.success("Horario asignado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones-empleado", empleadoId] });
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ocurrió un error al asignar el horario");
    }
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <Clock size={16} className="text-brand" />
            Historial de Horarios
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Asignar Horario
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4"><Spinner size="sm" /></div>
        ) : asignaciones?.length === 0 ? (
          <div className="text-center py-6 text-neutral-500 text-sm flex flex-col items-center">
            <AlertCircle size={24} className="mb-2 text-neutral-300" />
            <p>El colaborador no tiene ningún horario asignado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {asignaciones?.map((asig, idx) => (
              <div 
                key={asig.id} 
                className={`p-3 rounded-md border text-sm ${idx === 0 && !asig.fecha_hasta ? 'border-brand/30 bg-brand/5' : 'border-neutral-200 bg-neutral-50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-neutral-800">{asig.horario_nombre}</span>
                  {idx === 0 && !asig.fecha_hasta && (
                    <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Actual
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-500 flex gap-4">
                  <span>Desde: {new Date(asig.fecha_desde + 'T12:00:00').toLocaleDateString()}</span>
                  {asig.fecha_hasta && (
                    <span>Hasta: {new Date(asig.fecha_hasta + 'T12:00:00').toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Asignar Nuevo Horario"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Horario a Asignar</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("horario_id", { required: "Debe seleccionar un horario" })}
              >
                <option value="">-- Seleccionar --</option>
                {horarios?.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre}</option>
                ))}
              </select>
              {errors.horario_id && <p className="text-xs text-red-500">{errors.horario_id.message as string}</p>}
            </div>

            <Input 
              type="date"
              label="Vigente Desde"
              {...register("fecha_desde", { required: "La fecha de inicio es requerida" })}
              error={errors.fecha_desde?.message as string}
              hint="Si asignas una fecha, el horario actual se cerrará automáticamente un día antes."
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" loading={mutation.isPending}>Guardar Asignación</Button>
            </div>
          </form>
        </Modal>
      </CardBody>
    </Card>
  );
}
