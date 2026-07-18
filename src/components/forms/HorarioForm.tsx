"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { horarioService } from "@/services/horario.service";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/Card";
import type { Horario, HorarioCreateInput, HorarioUpdateInput, Turno } from "@/types/horario.types";
import { Save, ArrowLeft, Trash2, Plus } from "lucide-react";

interface HorarioFormProps {
  initialData?: Horario;
  isEdit?: boolean;
}

const DIAS_SEMANA = [
  { id: 0, nombre: "Lunes" },
  { id: 1, nombre: "Martes" },
  { id: 2, nombre: "Miércoles" },
  { id: 3, nombre: "Jueves" },
  { id: 4, nombre: "Viernes" },
  { id: 5, nombre: "Sábado" },
  { id: 6, nombre: "Domingo" },
];

export function HorarioForm({ initialData, isEdit = false }: HorarioFormProps) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const defaultTurnos = DIAS_SEMANA.map(d => ({
    dia_semana: d.id,
    hora_inicio: d.id < 5 ? "09:00" : null,
    hora_fin: d.id < 5 ? "18:00" : null,
    minutos_refrigerio: d.id < 5 ? 60 : 0,
    es_laborable: d.id < 5
  }));

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<HorarioUpdateInput>({
    defaultValues: initialData ? {
      ...initialData,
      turnos: initialData.turnos.map(t => ({
        dia_semana: t.dia_semana,
        hora_inicio: t.hora_inicio ? t.hora_inicio.substring(0, 5) : null,
        hora_fin: t.hora_fin ? t.hora_fin.substring(0, 5) : null,
        minutos_refrigerio: t.minutos_refrigerio,
        es_laborable: t.es_laborable
      }))
    } : {
      nombre: "",
      descripcion: "",
      tolerancia_ingreso_min: 15,
      tolerancia_salida_min: 0,
      horas_extras_permitidas: false,
      max_horas_extras_dia: 0,
      es_activo: true,
      turnos: defaultTurnos
    }
  });

  const { fields: turnosFields } = useFieldArray({
    control,
    name: "turnos"
  });

  const mutation = useMutation({
    mutationFn: (data: HorarioUpdateInput) => {
      // Ensure times are properly formatted for backend (HH:MM)
      const payload = {
        ...data,
        turnos: data.turnos.map(t => ({
          ...t,
          hora_inicio: t.es_laborable && t.hora_inicio ? t.hora_inicio : null,
          hora_fin: t.es_laborable && t.hora_fin ? t.hora_fin : null,
        }))
      };
      
      if (isEdit && initialData?.id) {
        return horarioService.actualizar(initialData.id, payload);
      }
      return horarioService.crear(payload as HorarioCreateInput);
    },
    onSuccess: () => {
      toast.success(`Horario ${isEdit ? "actualizado" : "creado"} exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["horarios"] });
      router.push("/admin/horarios");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ocurrió un error al guardar");
    }
  });

  const onSubmit = (data: HorarioUpdateInput) => {
    mutation.mutate(data);
  };

  const watchExtras = watch("horas_extras_permitidas");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/horarios")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Button type="submit" loading={mutation.isPending} className="gap-2">
          <Save className="w-4 h-4" /> {isEdit ? "Guardar Cambios" : "Crear Horario"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-lg">Información General</h3>
            
            <Input
              label="Nombre del Horario"
              placeholder="Ej: Oficina L-V"
              {...register("nombre", { required: "El nombre es requerido" })}
              error={errors.nombre?.message}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Descripción (Opcional)</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={3}
                {...register("descripcion")}
              />
            </div>
            
            {isEdit && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="es_activo"
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                  {...register("es_activo")}
                />
                <label htmlFor="es_activo" className="text-sm font-medium">Horario Activo</label>
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-lg">Configuración y Tolerancias</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Tolerancia Ingreso (min)"
                {...register("tolerancia_ingreso_min", { valueAsNumber: true, min: 0 })}
                error={errors.tolerancia_ingreso_min?.message}
              />
              <Input
                type="number"
                label="Tolerancia Salida (min)"
                {...register("tolerancia_salida_min", { valueAsNumber: true, min: 0 })}
                error={errors.tolerancia_salida_min?.message}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="horas_extras_permitidas"
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                  {...register("horas_extras_permitidas")}
                />
                <label htmlFor="horas_extras_permitidas" className="text-sm font-medium">Permitir Horas Extras</label>
              </div>
              
              {watchExtras && (
                <Input
                  type="number"
                  label="Máximo Horas Extras / Día (min)"
                  {...register("max_horas_extras_dia", { valueAsNumber: true, min: 0 })}
                  error={errors.max_horas_extras_dia?.message}
                  hint="0 = sin límite"
                />
              )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-4">Configuración de Turnos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Día</th>
                    <th className="px-4 py-3">Laborable</th>
                    <th className="px-4 py-3">Entrada</th>
                    <th className="px-4 py-3">Salida</th>
                    <th className="px-4 py-3 rounded-tr-lg">Refrigerio (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosFields.map((field, index) => {
                    const diaNombre = DIAS_SEMANA.find(d => d.id === field.dia_semana)?.nombre;
                    const isLaborable = watch(`turnos.${index}.es_laborable`);
                    
                    return (
                      <tr key={field.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{diaNombre}</td>
                        <td className="px-4 py-3">
                          <Controller
                            control={control}
                            name={`turnos.${index}.es_laborable`}
                            render={({ field: props }) => (
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-brand focus:ring-brand"
                                checked={props.value}
                                onChange={(e) => {
                                  props.onChange(e.target.checked);
                                  if (!e.target.checked) {
                                    setValue(`turnos.${index}.hora_inicio`, null);
                                    setValue(`turnos.${index}.hora_fin`, null);
                                    setValue(`turnos.${index}.minutos_refrigerio`, 0);
                                  }
                                }}
                              />
                            )}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="time"
                            {...register(`turnos.${index}.hora_inicio`)}
                            disabled={!isLaborable}
                            required={isLaborable}
                            className="w-32"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="time"
                            {...register(`turnos.${index}.hora_fin`)}
                            disabled={!isLaborable}
                            required={isLaborable}
                            className="w-32"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            {...register(`turnos.${index}.minutos_refrigerio`, { valueAsNumber: true, min: 0 })}
                            disabled={!isLaborable}
                            className="w-24"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
