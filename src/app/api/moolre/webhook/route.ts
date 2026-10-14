import { NextResponse } from "next/server";
import {
  getMoolreCallbackSecret,
  getMoolreExpectedAccountNumber,
  getMoolrePaymentStatus,
  markMoolreOrderPaid,
} from "@/lib/moolre";
import { getOrderByReference } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const event = await req.json();
    const data = event?.data;
    const expectedSecret = getMoolreCallbackSecret();

    if (!expectedSecret || !data || data.secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid callback secret." }, { status: 401 });
    }

    const reference = data.externalref;
    if (typeof reference !== "string" || !reference) {
      return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
    }

    // Failed callbacks must never mark an order as paid.
    if (Number(event.status) !== 1 || event.code !== "P01" || Number(data.txstatus) !== 1) {
      return NextResponse.json({ received: true, message: "Non-successful payment callback ignored." });
    }

    const order = await getOrderByReference(reference);
    if (!order) {
      // Acknowledge unknown references so Moolre does not retry forever.
      return NextResponse.json({ received: true, message: "Order not found." });
    }

    const expectedAccount = getMoolreExpectedAccountNumber();
    if (data.accountnumber !== expectedAccount || Math.abs(Number(data.amount) - order.totalAmount) > 0.01) {
      return NextResponse.json({ error: "Payment amount or merchant account did not match." }, { status: 400 });
    }

    // Confirm final status with Moolre before changing order or stock.
    const { transaction } = await getMoolrePaymentStatus(reference);
    if (transaction.externalref !== reference ||
        transaction.accountnumber !== expectedAccount ||
        Number(transaction.txstatus) !== 1 ||
        Math.abs(Number(transaction.amount) - order.totalAmount) > 0.01) {
      return NextResponse.json({ error: "Moolre status verification failed." }, { status: 400 });
    }

    await markMoolreOrderPaid({
      reference,
      transactionId: transaction.transactionid || data.transactionid,
      channel: "mobile_money",
      amount: Number(transaction.amount),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Moolre webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
