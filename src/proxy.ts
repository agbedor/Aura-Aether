import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getTokenRole(token: string): Promise<string | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return typeof payload.role === "string" && typeof payload.userId === "string" ? payload.role : null;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminToken = request.cookies.get("aura_admin_token")?.value;
  const legacyToken = request.cookies.get("aura_auth_token")?.value;
  const legacyRole = legacyToken ? await getTokenRole(legacyToken) : null;
  if (legacyRole === "ADMIN") {
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("aura_auth_token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
    return response;
  }
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginApi = pathname === "/api/auth/login" || pathname === "/api/auth/admin-logout";

  if (isAdminRoute) {
    if (!adminToken || (await getTokenRole(adminToken)) !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (adminToken && !isAdminLoginApi && !pathname.startsWith("/api/") && (await getTokenRole(adminToken)) === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api/|_next/static|_next/image|favicon.ico).*)",
  ],
};
