import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "NexusRH — Sistema de Recursos Humanos",
        template: "%s | NexusRH",
    },
    description:
        "Plataforma SaaS de gestión de Recursos Humanos. Control de asistencia, empleados y solicitudes.",
    keywords: ["recursos humanos", "asistencia", "empleados", "SaaS", "RRHH"],
    authors: [{ name: "NexusRH" }],
    robots: "index, follow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
