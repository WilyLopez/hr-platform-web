import { UserProfile } from "@/components/forms/UserProfile";

export default function SuperadminPerfilPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Perfil y Seguridad</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu información personal y opciones de seguridad
        </p>
      </div>
      <UserProfile />
    </div>
  );
}
