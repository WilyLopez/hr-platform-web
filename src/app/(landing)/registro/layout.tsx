import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Registro - NexusRH",
    description: "Crea tu cuenta en NexusRH y comienza a gestionar tu equipo.",
};

export default function RegistroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
