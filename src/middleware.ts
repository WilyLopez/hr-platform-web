import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string> = {
  "/superadmin": "SUPERADMIN",
  "/propietario": "PROPIETARIO",
  "/admin":       "ADMIN",
  "/empleado":    "EMPLEADO",
};

const LOGIN_ROUTES: Record<string, string> = {
  SUPERADMIN:  "/login?role=superadmin",
  PROPIETARIO: "/login?role=propietario",
  ADMIN:       "/login?role=admin",
  EMPLEADO:    "/login?role=empleado",
};

/** Safely decode a JWT payload without verification (edge-compatible, no crypto). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    // Pad to multiple of 4 for atob
    const padded = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded.padEnd(padded.length + (4 - (padded.length % 4)) % 4, "="));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPrefix = Object.keys(PROTECTED_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!protectedPrefix) return NextResponse.next();

  const isLoginPage = pathname === "/login";
  if (isLoginPage) return NextResponse.next();

  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    const requiredRol = PROTECTED_ROUTES[protectedPrefix];
    const loginPath   = LOGIN_ROUTES[requiredRol] ?? "/";
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // --- Role validation: get role from cookie or decode JWT ---
  const userRolCookie = request.cookies.get("user_rol")?.value;
  const payload = decodeJwtPayload(refreshToken);
  
  if (payload || userRolCookie) {
    const rolEnToken   = userRolCookie ?? (payload ? ((payload.rol ?? payload.role ?? "") as string) : "");
    const requiredRol  = PROTECTED_ROUTES[protectedPrefix];

    // PROPIETARIO can also access /admin routes (same dashboard, broader permissions)
    const allowed =
      rolEnToken === requiredRol ||
      (requiredRol === "ADMIN" && rolEnToken === "PROPIETARIO");

    if (!allowed) {
      // Redirect to the correct dashboard for this user's role if we know it
      const correctLogin = LOGIN_ROUTES[rolEnToken] ?? "/";
      return NextResponse.redirect(new URL(correctLogin, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/propietario/:path*",
    "/admin/:path*",
    "/empleado/:path*",
  ],
};