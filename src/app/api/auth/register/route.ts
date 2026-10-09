import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, address, city } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    let existingUser = null;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch {
      // Postgres fallback
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let user = {
      id: userId,
      name,
      email,
      role: "CUSTOMER" as const,
      phone: phone || null,
      address: address || null,
      city: city || null,
    };

    try {
      const created = await prisma.user.create({
        data: {
          id: userId,
          name,
          email,
          password: hashedPassword,
          role: "CUSTOMER",
          phone: phone || null,
          address: address || null,
          city: city || null,
        },
      });
      user = {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role as "CUSTOMER",
        phone: created.phone,
        address: created.address,
        city: created.city,
      };
    } catch (e) {
      console.warn("DB user creation fallback:", e);
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "CUSTOMER",
    });

    const response = NextResponse.json({ user });

    response.cookies.set("aura_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
