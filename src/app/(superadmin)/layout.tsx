"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { Topbar }  from "@/components/layout/dashboard/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  LayoutDashboard, Building2, CreditCard, ClipboardList,
} from "lucide-react";

const ITEMS = [
  { label: "Dashboard",  href: "/superadmin/dashboard",  icon: LayoutDashboard },
  { label: "Empresas",   href: "/superadmin/empresas",   icon: Building2       },
  { label: "Planes",     href: "/superadmin/planes",     icon: CreditCard      },
  { label: "Auditoría",  href: "/superadmin/auditoria",  icon: ClipboardList   },
];

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/superadmin/login";

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
          <Sidebar items={ITEMS} portalName="Super Admin" />
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