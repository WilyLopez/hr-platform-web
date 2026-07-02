"use client";
import { Menu, Bell, LogOut } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/hooks/useAuth";
import { useNotificacionStore } from "@/store/notificacion.store";
import { useNotificaciones } from "@/hooks/useNotificaciones";
import { Avatar, Tooltip, ThemeToggle, Dropdown } from "@/components/ui";
import { ROLES } from "@/utils/constants";

interface TopbarProps {
  breadcrumb?: React.ReactNode;
}

export function Topbar({ breadcrumb }: TopbarProps) {
  const toggle     = useUIStore((s) => s.toggleSidebar);
  const { usuario, logout } = useAuth();
  const noLeidas   = useNotificacionStore((s) => s.noLeidas);
  
  // Activa el polling de notificaciones y sincroniza el store global
  useNotificaciones();

  return (
    <header className="h-topbar bg-white border-b border-neutral-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded-md hover:bg-neutral-100"
        >
          <Menu size={20} />
        </button>
        {breadcrumb}
      </div>


      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Tooltip content={`${noLeidas} notificaciones sin leer`}>
          <button className="relative text-neutral-400 hover:text-neutral-700 p-2 rounded-md hover:bg-neutral-100 transition-colors">
            <Bell size={18} />
            {noLeidas > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>
        </Tooltip>

        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 hover:bg-neutral-50 p-1.5 rounded-md transition-colors text-left">
                {usuario && (
                  <Avatar name={usuario.correo || usuario.codigo_unico} size="sm" />
                )}
                <div className="hidden sm:block pr-1">
                  <p className="text-xs font-medium text-neutral-800 leading-tight">
                    {usuario?.correo || usuario?.codigo_unico}
                  </p>
                  <p className="text-xs text-neutral-400 leading-tight">
                    {usuario ? ROLES[usuario.rol] : ""}
                  </p>
                </div>
              </button>
            }
            items={[
              {
                label: "Mi perfil",
                onClick: () => {
                  if (usuario) {
                    const dashboardPath = import("@/utils/constants").then(c => {
                      const base = c.ROLES_DASHBOARD_PATH[usuario.rol].replace("/dashboard", "");
                      window.location.href = `${base}/perfil`;
                    });
                  }
                },
              },
              {
                label: "Configuración",
                onClick: () => {},
                disabled: true,
              },
              {
                label: "Cerrar sesión",
                icon: LogOut,
                onClick: logout,
                variant: "danger",
                separator: true,
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}