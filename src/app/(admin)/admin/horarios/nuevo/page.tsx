import { PageHeader } from "@/components/layout/shared/PageHeader";
import { HorarioForm } from "@/components/forms/HorarioForm";

export default function NuevoHorarioPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Crear Nuevo Horario" 
        description="Configura los turnos y tolerancias para un nuevo horario de trabajo"
      />
      <HorarioForm />
    </div>
  );
}
