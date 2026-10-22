"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatGhs } from "@/lib/paystack";
import { ShieldCheck, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    city: "",
    deliveryRange: "",
    notes: "",
  });

  const [deliverySettings, setDeliverySettings] = useState({ origin: "Adenta, Accra, Ghana", freePromo: false, ranges: [{ label: "0–5 km", fee: 20 }, { label: "5–10 km", fee: 30 }, { label: "10–15 km", fee: 40 }] });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        const s = data?.settings;
        if (!s) return;
        const ranges = String(s.deliveryRanges || "").split("\n").map((line: string) => {
          const [label, feeText] = line.split("|");
          return { label: (label || "").trim(), fee: Number((feeText || "").trim()) };
        }).filter((range: { label: string; fee: number }) => range.label && Number.isFinite(range.fee) && range.fee >= 0);
        setDeliverySettings({ origin: s.deliveryOrigin || "Adenta, Accra, Ghana", freePromo: s.deliveryFreePromo === "true", ranges });
        setFormData((prev) => ({ ...prev, deliveryRange: prev.deliveryRange || ranges[0]?.label || "" }));
      })
      .catch(() => {});
  }, []);

  const selectedRange = deliverySettings.ranges.find((range) => range.label === formData.deliveryRange);
  const deliveryFee = deliverySettings.freePromo ? 0 : selectedRange?.fee ?? 0;
  const checkoutTotal = subtotal + deliveryFee;

  // Auto-fill if customer is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
        customerPhone: prev.customerPhone || user.phone || "",
      }));
    }
  }, [user]);

  // If cart is empty, redirect
  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      router.push("/cart");
    }
  }, [items, router, isLoading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Call server initialization endpoint
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to initialize payment transaction.");
      }

      // Store current checkout reference for callback verification
      sessionStorage.setItem("last_aura_order_ref", data.reference);
      sessionStorage.setItem("last_aura_order_id", data.orderId);

      // Redirect customer to Paystack official authorization URL
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("No payment authorization URL was returned.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment initialization failed";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ECE5DD] p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
                EXPRESS DISPATCH
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1917]">
                Contact &amp; <span className="italic font-serif-luxury">Order Details.</span>
              </h1>
              {!user && (
                <p className="text-xs text-[#78716C] mt-1">
                  Checking out as Guest.{" "}
                  <Link href="/login" className="text-[#1C1917] font-semibold underline">
                    Log in
                  </Link>{" "}
                  to link this order to your account.
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePayNow} className="space-y-5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. Amara Mensah"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    placeholder="amara@example.com"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                  />
                  <p className="text-[10px] text-[#8C827A] mt-1">Receipt &amp; tracking will be sent here.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                    Phone / Mobile Money *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    placeholder="+233 24 123 4567"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                  />
                  <p className="text-[10px] text-[#8C827A] mt-1">For delivery driver contact.</p>
                </div>
              </div>

                  <div className="space-y-4 rounded-2xl border border-[#E8D9CE] bg-[#FAF7F3] p-4">
                <p className="text-sm leading-6 text-[#65534D]"><strong className="text-[#1C1917]">Delivery starts from {deliverySettings.origin}.</strong> Enter your destination and select the delivery range that applies to your location.</p>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#4A443F]">Delivery address *</label>
                  <input type="text" name="deliveryAddress" required placeholder="House number, street, landmark…" value={formData.deliveryAddress} onChange={handleChange} className="w-full rounded-xl border border-[#DDD6CD] bg-white px-4 py-3 text-sm text-[#1C1917] outline-none focus:border-[#1C1917]" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#4A443F]">Area / city *</label>
                    <input type="text" name="city" required placeholder="e.g. Madina" value={formData.city} onChange={handleChange} className="w-full rounded-xl border border-[#DDD6CD] bg-white px-4 py-3 text-sm text-[#1C1917] outline-none focus:border-[#1C1917]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#4A443F]">Delivery range *</label>
                    <select name="deliveryRange" required value={formData.deliveryRange} onChange={handleChange} className="w-full rounded-xl border border-[#DDD6CD] bg-white px-4 py-3 text-sm text-[#1C1917] outline-none focus:border-[#1C1917]">
                      {deliverySettings.ranges.length === 0 ? <option value="">Delivery rates not set yet</option> : deliverySettings.ranges.map((range) => <option key={range.label} value={range.label}>{range.label} — {deliverySettings.freePromo ? "Free delivery" : formatGhs(range.fee)}</option>)}
                    </select>
                  </div>
                </div>
                {deliverySettings.freePromo && <p className="text-sm font-semibold text-emerald-700">Free delivery promotion is active — delivery is free on this order.</p>}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Any notes about your order..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                />
              </div>

              {/* Pay With Paystack Action */}
              <div className="pt-6 border-t border-[#EFE9E2] space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Paystack...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatGhs(checkoutTotal)} via Paystack</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#78716C] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Supports Ghana Mobile Money (MTN, Telecel, AT) and Debit/Credit Cards</span>
                </p>
              </div>
            </form>
          </div>

          {/* Right: Order Overview */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#ECE5DD] p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h2 className="font-serif-luxury text-xl font-semibold text-[#1C1917] pb-4 border-b border-[#EFE9E2]">
              Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            {/* List */}
            <div className="divide-y divide-[#F5EFEB] max-h-80 overflow-y-auto pr-2 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-4">
                  <div className="w-16 h-18 bg-[#FAF7F4] rounded-lg relative overflow-hidden shrink-0 border border-[#EDE7DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-serif-luxury text-sm font-semibold text-[#1C1917]">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8C827A] uppercase">
                      Qty: {item.quantity} • {item.size}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#1C1917]">
                    {formatGhs(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#EFE9E2] pt-4 space-y-2 text-xs text-[#5C554F]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1917]">{formatGhs(subtotal)}</span>
              </div>
                            <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-[#1C1917]">{deliverySettings.freePromo ? "FREE" : selectedRange ? formatGhs(deliveryFee) : "Select a range"}</span>
              </div>
              <div className="pt-3 border-t border-[#EFE9E2] flex justify-between text-base font-bold text-[#1C1917]">
                <span>Total Due</span>
                <span>{formatGhs(checkoutTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
