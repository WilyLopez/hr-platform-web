"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { horarioService } from "@/services/horario.service";
import { PageHeader } from "@/components/layout/shared/PageHeader";
import { HorarioForm } from "@/components/forms/HorarioForm";
import { Loader2 } from "lucide-react";

export default function EditarHorarioPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: horario, isLoading } = useQuery({
    queryKey: ["horario", id],
    queryFn: () => horarioService.obtener(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!horario) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-medium text-foreground">Horario no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Editar Horario" 
        description={`Actualizando configuración de ${horario.nombre}`}
      />
      <HorarioForm initialData={horario} isEdit />
    </div>
  );
}
