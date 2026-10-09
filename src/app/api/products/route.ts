import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const giftSets =
      searchParams.get("giftSets") === "true"
        ? true
        : searchParams.get("giftSets") === "false"
        ? false
        : undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") as "price-asc" | "price-desc" | "newest" | "name") || undefined;

    const products = await getProducts({ category, featured, giftSets, search, sort });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name || !body.price || !body.description) {
      return NextResponse.json({ error: "Name, price, and description are required" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProduct = await createProduct({
      ...body,
      slug,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      stock: parseInt(body.stock || "10", 10),
      inStock: (parseInt(body.stock || "10", 10)) > 0,
      image: body.image || "/images/products/meadow.svg",
      categoryId: body.categoryId || "cat-fresh",
      size: body.size || "50ml",
      scentNotes: body.scentNotes || "ARTISANAL ACCORD",
      isFeatured: !!body.isFeatured,
      isGiftSet: !!body.isGiftSet,
      isSale: !!body.isSale,
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    if (updates.stock !== undefined) {
      updates.stock = parseInt(updates.stock, 10);
      updates.inStock = updates.stock > 0;
    }

    const updated = await updateProduct(id, updates);
    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
