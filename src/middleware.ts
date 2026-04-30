import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string> = {
  "/superadmin": "SUPERADMIN",
  "/propietario": "PROPIETARIO",
  "/admin": "ADMIN",
};

const LOGIN_ROUTES: Record<string, string> = {
  SUPERADMIN:  "/superadmin/login",
  PROPIETARIO: "/propietario/login",
  ADMIN:       "/admin/login",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPrefix = Object.keys(PROTECTED_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!protectedPrefix) return NextResponse.next();

  const isLoginPage = Object.values(LOGIN_ROUTES).some((p) =>
    pathname.startsWith(p)
  );
  if (isLoginPage) return NextResponse.next();

  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    const requiredRol   = PROTECTED_ROUTES[protectedPrefix];
    const loginPath     = LOGIN_ROUTES[requiredRol] ?? "/";
    const redirectUrl   = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
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