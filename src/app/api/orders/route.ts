import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getOrdersByUserId, getAllOrders, updateOrderStatus } from "@/lib/db";
import { Order } from "@/types";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    let orders: Order[] = [];
    if (payload.role === "ADMIN") {
      orders = await getAllOrders();
    } else {
      orders = await getOrdersByUserId(payload.userId);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aura_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin permission required" }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Orders PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
