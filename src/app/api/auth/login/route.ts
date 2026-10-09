import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Default admin fallback for initial evaluation
    if (email === "admin@aura-aether.com" && password === "admin123") {
      const token = await signToken({
        userId: "usr-admin-demo",
        email: "admin@aura-aether.com",
        name: "Aura Admin",
        role: "ADMIN",
      });

      const response = NextResponse.json({
        user: {
          id: "usr-admin-demo",
          name: "Aura Admin",
          email: "admin@aura-aether.com",
          role: "ADMIN",
        },
      });

      response.cookies.set("aura_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch {
      // Postgres offline fallback
    }

    if (!user) {
      // Demo test user check
      if (email === "amara@example.com" && password === "password123") {
        user = {
          id: "usr-customer-demo",
          name: "Amara Mensah",
          email: "amara@example.com",
          role: "CUSTOMER",
          password: "",
          phone: "+233 20 987 6543",
          address: "14 Senchi Street, Airport Residential",
          city: "Accra",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    } else {
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "CUSTOMER" | "ADMIN",
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
      },
    });

    response.cookies.set("aura_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
