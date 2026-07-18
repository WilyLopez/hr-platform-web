"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Topbar }  from "@/components/layout/dashboard/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import {
  LayoutDashboard, FileText, Bell, UserCircle,
} from "lucide-react";

const ITEMS = [
  { label: "Mi Dashboard",    href: "/empleado/dashboard",      icon: LayoutDashboard },
  { label: "Mis Solicitudes", href: "/empleado/solicitudes",    icon: FileText        },
  { label: "Notificaciones",  href: "/empleado/notificaciones", icon: Bell            },
  { label: "Mi Perfil",       href: "/empleado/perfil",         icon: UserCircle      },
];

export default function EmpleadoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/empleado/login";

  if (isLoginPage) {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="sidebar-layout">
        <Sidebar items={ITEMS} portalName="Portal Empleado" />
        <div className="sidebar-content">
          <Topbar />
          <main className="main-content">
            <div className="page-container">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
