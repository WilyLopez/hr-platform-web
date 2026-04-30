"use client";
import { Menu, Bell, LogOut } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/hooks/useAuth";
import { useNotificacionStore } from "@/store/notificacion.store";
import { Avatar, Tooltip } from "@/components/ui";
import { ROLES } from "@/utils/constants";

interface TopbarProps {
  breadcrumb?: React.ReactNode;
}

export function Topbar({ breadcrumb }: TopbarProps) {
  const toggle     = useUIStore((s) => s.toggleSidebar);
  const { usuario, logout } = useAuth();
  const noLeidas   = useNotificacionStore((s) => s.noLeidas);

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
        <Tooltip content={`${noLeidas} notificaciones sin leer`}>
          <button className="relative text-neutral-400 hover:text-neutral-700 p-2 rounded-md hover:bg-neutral-100 transition-colors">
            <Bell size={18} />
            {noLeidas > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>
        </Tooltip>

        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          {usuario && (
            <Avatar name={usuario.codigo_unico} size="sm" />
          )}
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-neutral-800 leading-tight">
              {usuario?.codigo_unico}
            </p>
            <p className="text-xs text-neutral-400 leading-tight">
              {usuario ? ROLES[usuario.rol] : ""}
            </p>
          </div>
        </div>

        <Tooltip content="Cerrar sesión">
          <button
            onClick={logout}
            className="text-neutral-400 hover:text-danger transition-colors p-2 rounded-md hover:bg-neutral-100"
          >
            <LogOut size={16} />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}