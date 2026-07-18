"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { horarioService } from "@/services/horario.service";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Settings2, Copy, Power, PowerOff } from "lucide-react";
import { DataTable, Column } from "@/components/tables/DataTable";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/Badge";
import type { Horario } from "@/types/horario.types";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/Tooltip";

export default function HorariosPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  const { data: horarios, isLoading } = useQuery({
    queryKey: ["horarios"],
    queryFn: () => horarioService.listar(true),
  });

  const deleteMutation = useMutation({
    mutationFn: horarioService.eliminar,
    onSuccess: () => {
      toast.success("Horario eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["horarios"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al eliminar el horario";
      toast.error(msg);
      setIsDeleteDialogOpen(false);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (h: Horario) => horarioService.actualizar(h.id, {
      ...h,
      turnos: h.turnos.map(t => ({
        dia_semana: t.dia_semana,
        hora_inicio: t.hora_inicio,
        hora_fin: t.hora_fin,
        minutos_refrigerio: t.minutos_refrigerio,
        es_laborable: t.es_laborable
      })),
      es_activo: !h.es_activo
    }),
    onSuccess: () => {
      toast.success("Estado actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["horarios"] });
    },
    onError: () => toast.error("Error al actualizar el estado")
  });

  const handleEdit = (horario: Horario) => {
    router.push(`/admin/horarios/${horario.id}`);
  };

  const handleDelete = (horario: Horario) => {
    setSelectedHorario(horario);
    setIsDeleteDialogOpen(true);
  };

  const columns: Column<Horario>[] = [
    {
      header: "Nombre",
      key: "nombre",
      render: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.nombre}</p>
          {row.descripcion && (
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.descripcion}</p>
          )}
        </div>
      )
    },
    {
      header: "Turnos",
      key: "turnos",
      render: (row) => (
        <span className="text-sm">
          {row.turnos.filter(t => t.es_laborable).length} días laborables
        </span>
      )
    },
    {
      header: "Tolerancia (Min)",
      key: "tolerancia_ingreso_min",
      render: (row) => (
        <span className="text-sm">
          Ingreso: {row.tolerancia_ingreso_min}m | Salida: {row.tolerancia_salida_min}m
        </span>
      )
    },
    {
      header: "Empleados",
      key: "empleados_asignados",
      render: (row) => (
        <Badge variant="neutral">
          {row.empleados_asignados || 0} asignados
        </Badge>
      )
    },
    {
      header: "Estado",
      key: "es_activo",
      render: (row) => (
        <Badge variant={row.es_activo ? "success" : "neutral"}>
          {row.es_activo ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      header: "Acciones",
      key: "id",
      render: (row) => (
        <div className="flex gap-2">
          <Tooltip content="Editar horario">
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handleEdit(row)}
            >
              <Edit className="w-4 h-4 text-blue-500" />
            </Button>
          </Tooltip>
          
          <Tooltip content={row.es_activo ? "Desactivar" : "Activar"}>
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => toggleStatusMutation.mutate(row)}
            >
              {row.es_activo ? (
                <PowerOff className="w-4 h-4 text-orange-500" />
              ) : (
                <Power className="w-4 h-4 text-green-500" />
              )}
            </Button>
          </Tooltip>
          
          <Tooltip content="Eliminar">
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handleDelete(row)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestión de Horarios" 
        description="Administra los horarios y turnos de trabajo de la empresa"
        action={
          <Button onClick={() => router.push("/admin/horarios/nuevo")} className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Horario
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={horarios || []}
          keyField="id"
          isLoading={isLoading}
          emptyTitle="No hay horarios"
          emptyDesc="Todavía no se han configurado horarios."
        />
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedHorario && deleteMutation.mutate(selectedHorario.id)}
        title="¿Eliminar horario?"
        description={`Estás a punto de eliminar el horario "${selectedHorario?.nombre}". Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
