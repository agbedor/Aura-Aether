import { randomUUID } from "crypto";
import { importPKCS8, SignJWT } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

async function getGoogleAccessToken(serviceAccount: {
  client_email: string;
  private_key: string;
}) {
  const privateKey = await importPKCS8(
    serviceAccount.private_key.replace(/\\n/g, "\n"),
    "RS256"
  );

  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/devstorage.read_write",
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(serviceAccount.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error("Could not authenticate with Firebase Storage.");
  }
  return data.access_token as string;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("aura_auth_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!bucket || !serviceAccountJson) {
    return NextResponse.json(
      {
        error:
          "Firebase image uploads are not configured. Set FIREBASE_STORAGE_BUCKET and FIREBASE_SERVICE_ACCOUNT_JSON in your server environment.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    }
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, GIF or AVIF image. SVG uploads are disabled for security." },
        { status: 415 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Images must be 10 MB or smaller." }, { status: 413 });
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as {
      client_email: string;
      private_key: string;
    };
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      return NextResponse.json(
        { error: "Firebase service-account JSON is missing client_email or private_key." },
        { status: 503 }
      );
    }

    const accessToken = await getGoogleAccessToken(serviceAccount);
    const objectName = `products/${randomUUID()}.${extension}`;
    const downloadToken = randomUUID();
    const uploadUrl = new URL(
      `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o`
    );
    uploadUrl.searchParams.set("uploadType", "media");
    uploadUrl.searchParams.set("name", objectName);

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.type,
      },
      body: await file.arrayBuffer(),
      cache: "no-store",
    });

    if (!uploadResponse.ok) {
      console.error("Firebase Storage upload failed:", await uploadResponse.text());
      return NextResponse.json({ error: "Firebase could not upload this image." }, { status: 502 });
    }

    const metadataUrl = new URL(
      `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectName)}`
    );
    const metadataResponse = await fetch(metadataUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      }),
      cache: "no-store",
    });

    if (!metadataResponse.ok) {
      console.error("Firebase Storage metadata update failed:", await metadataResponse.text());
      return NextResponse.json(
        { error: "The image uploaded, but Firebase could not prepare its display URL." },
        { status: 502 }
      );
    }

    const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Admin Firebase image upload error:", error);
    return NextResponse.json(
      { error: "Could not upload image. Check your Firebase Storage configuration." },
      { status: 500 }
    );
  }
}
