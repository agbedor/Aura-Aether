import { NextResponse } from "next/server";
import { createOrder, getProductById } from "@/lib/db";
import { initiateMoolrePayment, MoolreChannel } from "@/lib/moolre";
import { OrderItem } from "@/types";

const allowedChannels = new Set<MoolreChannel>(["13", "6", "7"]);

function normalizeGhanaPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length === 12) return `0${digits.slice(3)}`;
  if (digits.startsWith("0") && digits.length === 10) return digits;
  if (digits.length === 9) return `0${digits}`;
  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      city,
      notes,
      items,
      userId,
      paymentChannel,
    } = body;

    if (
      !customerName || !customerEmail || !customerPhone || !deliveryAddress ||
      !city || !Array.isArray(items) || items.length === 0
    ) {
      return NextResponse.json(
        { error: "Please provide all required delivery and contact details." },
        { status: 400 }
      );
    }

    if (!allowedChannels.has(paymentChannel)) {
      return NextResponse.json({ error: "Choose a supported Mobile Money network." }, { status: 400 });
    }

    const payer = normalizeGhanaPhone(String(customerPhone));
    if (!payer) {
      return NextResponse.json(
        { error: "Enter a valid Ghana phone number, for example 0241234567." },
        { status: 400 }
      );
    }

    const email = String(customerEmail).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    // Check configuration before creating an order.
    if (!process.env.MOOLRE_USER || !process.env.MOOLRE_PUB_KEY || !process.env.MOOLRE_ACCOUNT_NUMBER) {
      return NextResponse.json(
        { error: "Moolre is not configured yet. Add the required Moolre credentials to your local environment." },
        { status: 503 }
      );
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid item in cart." }, { status: 400 });
      }

      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
      }
      if (!product.inStock || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${product.stock} available.` },
          { status: 400 }
        );
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        id: `oi-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        orderId: "",
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        size: product.size,
        image: product.image,
      });
    }

    const deliveryFee = 50;
    const totalAmount = Number((subtotal + deliveryFee).toFixed(2));
    const paymentReference = `AA-${Date.now()}-${cryptoRandom()}`.toUpperCase();
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await createOrder({
      orderNumber,
      userId: userId || null,
      customerName: String(customerName).trim(),
      customerEmail: email,
      customerPhone: String(customerPhone).trim(),
      deliveryAddress: String(deliveryAddress).trim(),
      city: String(city).trim(),
      notes: notes ? String(notes).trim() : null,
      subtotal,
      deliveryFee,
      totalAmount,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentReference,
      items: orderItems,
    });

    const payment = await initiateMoolrePayment({
      channel: paymentChannel as MoolreChannel,
      payer,
      amount: totalAmount,
      reference: paymentReference,
    });

    if (!payment.initiated) {
      return NextResponse.json({
        success: false,
        otpRequired: payment.otpRequired,
        error: payment.message,
        reference: paymentReference,
        orderNumber,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      reference: paymentReference,
      orderNumber,
      orderId: order.id,
      message: payment.message,
    });
  } catch (error) {
    console.error("Moolre initialization error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start Moolre payment." },
      { status: 500 }
    );
  }
}

function cryptoRandom() {
  return Math.floor(Math.random() * 0xfffff).toString(16);
}
