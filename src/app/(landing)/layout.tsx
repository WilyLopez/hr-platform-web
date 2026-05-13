import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NexusRH - Gestion de Recursos Humanos SaaS',
  description: 'Plataforma SaaS multi-tenant para asistencia QR, empleados, solicitudes, auditoria y reportes.',
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
