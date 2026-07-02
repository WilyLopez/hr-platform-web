import { UserProfile } from "@/components/forms/UserProfile";

export default function PropietarioPerfilPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Perfil y Seguridad</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gestiona tu información personal y opciones de seguridad
        </p>
      </div>
      <UserProfile />
    </div>
  );
}
