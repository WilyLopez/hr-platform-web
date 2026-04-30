"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Topbar }  from "@/components/layout/dashboard/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  LayoutDashboard, Users, Clock, FileText, Settings, ClipboardList, Bell,
} from "lucide-react";

const ITEMS = [
  { label: "Dashboard",      href: "/admin/dashboard",     icon: LayoutDashboard },
  { label: "Empleados",      href: "/admin/empleados",     icon: Users           },
  { label: "Asistencia",     href: "/admin/asistencia",    icon: Clock           },
  { label: "Solicitudes",    href: "/admin/solicitudes",   icon: FileText        },
  { label: "Tipos permiso",  href: "/admin/tipos-permiso", icon: Settings        },
  { label: "Auditoría",      href: "/admin/auditoria",     icon: ClipboardList   },
  { label: "Notificaciones", href: "/admin/notificaciones",icon: Bell            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="sidebar-layout">
          <Sidebar items={ITEMS} portalName="Admin RRHH" />
          <div className="sidebar-content">
            <Topbar />
            <main className="main-content">
              <div className="page-container">{children}</div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}