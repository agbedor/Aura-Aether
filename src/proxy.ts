import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getAdminRole(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "ADMIN" && typeof payload.userId === "string";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminToken = request.cookies.get("aura_admin_token")?.value;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginApi = pathname === "/api/auth/login" || pathname === "/api/auth/admin-logout";

  if (isAdminRoute) {
    if (!adminToken || !(await getAdminRole(adminToken))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (adminToken && !isAdminLoginApi && !pathname.startsWith("/api/") && await getAdminRole(adminToken)) {
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
