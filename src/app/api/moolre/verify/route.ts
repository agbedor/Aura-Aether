import { NextResponse } from "next/server";
import { getOrderByReference } from "@/lib/db";
import {
  getMoolrePaymentStatus,
  getMoolreExpectedAccountNumber,
  markMoolreOrderPaid,
} from "@/lib/moolre";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();
    if (typeof reference !== "string" || !reference.trim()) {
      return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    }

    const order = await getOrderByReference(reference);
    if (!order) {
      return NextResponse.json({ error: "Order was not found." }, { status: 404 });
    }

    if (order.status === "PAID" && order.paymentStatus === "SUCCESS") {
      return NextResponse.json({ success: true, order, message: "Order already paid." });
    }

    const { transaction, accountNumber } = await getMoolrePaymentStatus(reference);
    if (transaction.externalref !== reference || transaction.accountnumber !== accountNumber ||
        accountNumber !== getMoolreExpectedAccountNumber()) {
      return NextResponse.json({ error: "Moolre transaction details could not be matched to this order." }, { status: 400 });
    }

    if (Number(transaction.txstatus) === 0) {
      return NextResponse.json({
        success: false,
        pending: true,
        message: "Payment is still pending. Approve the request on your phone.",
      }, { status: 202 });
    }

    if (Number(transaction.txstatus) !== 1) {
      return NextResponse.json({
        success: false,
        pending: false,
        error: "Moolre has not confirmed this payment as successful.",
      }, { status: 400 });
    }

    const paidAmount = Number(transaction.amount);
    if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - order.totalAmount) > 0.01) {
      console.error("Moolre amount mismatch", {
        reference,
        expected: order.totalAmount,
        received: transaction.amount,
      });
      return NextResponse.json({ error: "The verified payment amount does not match the order total." }, { status: 400 });
    }

    const updatedOrder = await markMoolreOrderPaid({
      reference,
      transactionId: transaction.transactionid,
      channel: "mobile_money",
      amount: paidAmount,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Unable to confirm the order." }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updatedOrder, message: "Payment verified." });
  } catch (error) {
    console.error("Moolre verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 502 }
    );
  }
}
