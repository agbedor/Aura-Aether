import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DEFAULTS = {
  heroTitle: "Your scent. Your signature.",
  heroDescription: "Discover fragrances that feel like you. Find your signature scent, mark a moment, and leave a little magic wherever you go.",
  motto: "Your scent. Your signature.",
  announcement: "Find your signature scent with Aura & Aether Parfums.",
  aboutIntro: "Aura & Aether was created for the moments, moods, and memories that make you who you are.",
};

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("aura_auth_token")?.value;
  const payload = token ? await verifyToken(token) : null;
  return !!payload && payload.role === "ADMIN";
}

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const settings = { ...DEFAULTS } as Record<string, string>;
    for (const row of rows) settings[row.key] = row.value;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Site settings GET error:", error);
    return NextResponse.json({ settings: DEFAULTS });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const allowed = Object.keys(DEFAULTS);
    const entries = Object.entries(body.settings || {}).filter(
      ([key, value]) => allowed.includes(key) && typeof value === "string"
    );
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: value as string },
          update: { value: value as string },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Site settings PUT error:", error);
    return NextResponse.json({ error: "Could not save site settings. Check that the database schema is up to date." }, { status: 500 });
  }
}
