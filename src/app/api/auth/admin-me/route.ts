import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_admin_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, name: true, email: true, role: true },
      });
      if (dbUser?.role === "ADMIN") return NextResponse.json({ user: dbUser });
    } catch {
      // Fall back to the verified administrator token if the database is unavailable.
    }

    return NextResponse.json({
      user: { id: payload.userId, name: payload.name, email: payload.email, role: payload.role },
    });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
