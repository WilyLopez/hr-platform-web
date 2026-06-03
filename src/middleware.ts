import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Rol } from "@/types/auth.types";

const RUTAS_ROLES: Record<string, Rol[]> = {
  "/superadmin": ["SUPERADMIN"],
  "/propietario": ["PROPIETARIO"],
  "/admin": ["ADMIN", "EMPLEADO"],
};

const RUTAS_LOGIN: Record<string, string> = {
  "/superadmin": "/superadmin/login",
  "/propietario": "/propietario/login",
  "/admin":       "/admin/login",
};

const DASHBOARD_POR_ROL: Record<Rol, string> = {
  SUPERADMIN:  "/superadmin/dashboard",
  PROPIETARIO: "/propietario/dashboard",
  ADMIN:       "/admin/dashboard",
  EMPLEADO:    "/admin/dashboard",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rutaBase = Object.keys(RUTAS_ROLES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!rutaBase) return NextResponse.next();

  const esLogin = pathname === RUTAS_LOGIN[rutaBase];
  const rol     = request.cookies.get("user_rol")?.value as Rol | undefined;
  const refresh = request.cookies.get("refresh_token")?.value;
  const autenticado = !!rol && !!refresh;

  // Ya autenticado intentando entrar al login → redirigir a su dashboard
  if (esLogin && autenticado && RUTAS_ROLES[rutaBase].includes(rol!)) {
    return NextResponse.redirect(
      new URL(DASHBOARD_POR_ROL[rol!], request.url)
    );
  }

  // No autenticado en ruta protegida → al login
  if (!autenticado && !esLogin) {
    const url = new URL(RUTAS_LOGIN[rutaBase], request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Autenticado pero con rol incorrecto para esta sección → a su dashboard
  if (autenticado && !esLogin && !RUTAS_ROLES[rutaBase].includes(rol!)) {
    return NextResponse.redirect(
      new URL(DASHBOARD_POR_ROL[rol!], request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/propietario/:path*",
    "/admin/:path*",
  ],
};