"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Topbar }  from "@/components/layout/dashboard/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  LayoutDashboard, Building2, MapPin, Users, CreditCard, ClipboardList,
} from "lucide-react";

const ITEMS = [
  { label: "Dashboard",       href: "/propietario/dashboard",       icon: LayoutDashboard },
  { label: "Mi empresa",      href: "/propietario/empresa",         icon: Building2       },
  { label: "Sedes",           href: "/propietario/sedes",           icon: MapPin          },
  { label: "Administradores", href: "/propietario/administradores", icon: Users           },
  { label: "Suscripción",     href: "/propietario/suscripcion",     icon: CreditCard      },
  { label: "Auditoría",       href: "/propietario/auditoria",       icon: ClipboardList   },
];

export default function PropietarioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/propietario/login";

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
          <Sidebar items={ITEMS} portalName="Propietario" />
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