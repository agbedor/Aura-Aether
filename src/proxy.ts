import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getTokenRole(token: string): Promise<string | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return typeof payload.role === "string" && typeof payload.userId === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function clearLegacyCookie(response: NextResponse) {
  response.cookies.set("aura_auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

function migrateLegacyAdminToken(request: NextRequest, token: string, pathname: string) {
  const isApi = pathname.startsWith("/api/");
  const response = isApi
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("aura_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  clearLegacyCookie(response);
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminToken = request.cookies.get("aura_admin_token")?.value;
  const legacyToken = request.cookies.get("aura_auth_token")?.value;
  const adminRole = adminToken ? await getTokenRole(adminToken) : null;
  const legacyRole = legacyToken ? await getTokenRole(legacyToken) : null;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginApi = pathname === "/api/auth/login" || pathname === "/api/auth/admin-logout";

  // Migrate older administrator sessions instead of repeatedly sending the
  // administrator back to the login page because the cookie name changed.
  if (legacyToken && legacyRole === "ADMIN" && adminRole !== "ADMIN") {
    return migrateLegacyAdminToken(request, legacyToken, pathname);
  }

  if (isAdminRoute) {
    if (adminRole !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Clean up a leftover legacy cookie without invalidating the valid session.
    if (legacyToken) return clearLegacyCookie(NextResponse.next());
    return NextResponse.next();
  }

  if (adminRole === "ADMIN" && !isAdminLoginApi && !pathname.startsWith("/api/")) {
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
