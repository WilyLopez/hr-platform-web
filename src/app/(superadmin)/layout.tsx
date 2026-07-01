"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Topbar }  from "@/components/layout/dashboard/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import {
  LayoutDashboard, Building2, CreditCard, ClipboardList, Repeat,
} from "lucide-react";

const ITEMS = [
  { label: "Dashboard",      href: "/superadmin/dashboard",      icon: LayoutDashboard },
  { label: "Empresas",       href: "/superadmin/empresas",       icon: Building2       },
  { label: "Suscripciones",  href: "/superadmin/suscripciones",  icon: Repeat          },
  { label: "Planes",         href: "/superadmin/planes",         icon: CreditCard      },
  { label: "Auditoría",      href: "/superadmin/auditoria",      icon: ClipboardList   },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/superadmin/login";

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
        <Sidebar items={ITEMS} portalName="Super Admin" />
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