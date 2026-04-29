import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SisRRHH - Plataforma SaaS de Gestión de RRHH',
  description: 'Gestiona tu equipo con tecnología enterprise. Automatiza asistencia, vacaciones, permisos y nómina.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
