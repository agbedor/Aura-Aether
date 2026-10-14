import { prisma } from "@/lib/db";

const LIVE_BASE_URL = "https://api.moolre.com";
const SANDBOX_BASE_URL = "https://sandbox.moolre.com";

export type MoolreChannel = "13" | "6" | "7";

type MoolreEnvelope<T> = {
  status: number | string;
  code?: string;
  message?: string | null;
  data: T;
};

type MoolreTransaction = {
  txstatus: number;
  accountnumber: string;
  amount: string;
  transactionid?: string | null;
  externalref: string;
  payer?: string;
  thirdpartyref?: string;
};

function getConfig() {
  const user = process.env.MOOLRE_USER;
  const publicKey = process.env.MOOLRE_PUB_KEY;
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER;
  const baseUrl =
    process.env.MOOLRE_BASE_URL ||
    (process.env.MOOLRE_ENV === "live" ? LIVE_BASE_URL : SANDBOX_BASE_URL);

  if (!user || !publicKey || !accountNumber) {
    throw new Error(
      "Moolre is not configured. Add MOOLRE_USER, MOOLRE_PUB_KEY and MOOLRE_ACCOUNT_NUMBER to your environment."
    );
  }

  return { user, publicKey, accountNumber, baseUrl };
}

async function moolreRequest<T>(path: string, body: Record<string, unknown>) {
  const config = getConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-USER": config.user,
      "X-API-PUBKEY": config.publicKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json()) as MoolreEnvelope<T>;
  if (!response.ok || Number(payload.status) !== 1) {
    throw new Error(payload.message || payload.code || "Moolre request failed.");
  }
  return { payload, config };
}

export async function initiateMoolrePayment(params: {
  channel: MoolreChannel;
  payer: string;
  amount: number;
  reference: string;
}) {
  const { payload } = await moolreRequest<string>("/open/transact/payment", {
    type: 1,
    channel: params.channel,
    currency: "GHS",
    payer: params.payer,
    amount: params.amount.toFixed(2),
    externalref: params.reference,
    accountnumber: getConfig().accountNumber,
  });

  // TP14 means Moolre requires an additional phone verification step.
  if (payload.code === "TP14") {
    return {
      initiated: false,
      otpRequired: true,
      message: payload.message || "Moolre requires additional phone verification.",
    };
  }

  return {
    initiated: true,
    otpRequired: false,
    message: payload.message || "Payment prompt sent to your phone.",
    transactionId: typeof payload.data === "string" ? payload.data : undefined,
  };
}

export async function getMoolrePaymentStatus(reference: string) {
  const config = getConfig();
  const { payload } = await moolreRequest<MoolreTransaction>(
    "/open/transact/status",
    {
      type: 1,
      idtype: 1,
      id: reference,
      accountnumber: config.accountNumber,
    }
  );
  return { transaction: payload.data, accountNumber: config.accountNumber };
}

export async function markMoolreOrderPaid(params: {
  reference: string;
  transactionId?: string | null;
  channel?: string;
  amount: number;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { paymentReference: params.reference },
      include: { items: true, payment: true },
    });
    if (!order) return null;

    if (order.paymentStatus === "SUCCESS" && order.status === "PAID") {
      return order;
    }

    // Only one webhook/status check may claim a pending order and decrement stock.
    const claimed = await tx.order.updateMany({
      where: { id: order.id, paymentStatus: "PENDING" },
      data: { status: "PAID", paymentStatus: "SUCCESS" },
    });

    if (claimed.count === 0) {
      const latest = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true, payment: true },
      });
      return latest;
    }

    await tx.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        reference: params.reference,
        provider: "MOOLRE",
        providerTransactionId: params.transactionId || null,
        amount: params.amount,
        currency: "GHS",
        status: "SUCCESS",
        channel: params.channel || "mobile_money",
        paidAt: new Date(),
      },
      update: {
        provider: "MOOLRE",
        providerTransactionId: params.transactionId || null,
        amount: params.amount,
        status: "SUCCESS",
        channel: params.channel || "mobile_money",
        paidAt: new Date(),
      },
    });

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: { items: true, payment: true },
    });
  });
}

export function getMoolreExpectedAccountNumber() {
  return getConfig().accountNumber;
}

export function getMoolreCallbackSecret() {
  return process.env.MOOLRE_CALLBACK_SECRET || "";
}
