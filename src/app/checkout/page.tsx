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
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    city: "Accra",
    notes: "",
  });

  const [paymentChannel, setPaymentChannel] = useState<"13" | "6" | "7">("13");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-fill if customer is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
        customerPhone: prev.customerPhone || user.phone || "",
        deliveryAddress: prev.deliveryAddress || user.address || "",
        city: prev.city || user.city || "Accra",
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
      const response = await fetch("/api/moolre/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null,
          paymentChannel,
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

      // Moolre sends a Mobile Money approval prompt to the customer's phone.
      router.push(`/order/success?reference=${encodeURIComponent(data.reference)}`);
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
                Delivery &amp; <span className="italic font-serif-luxury">Contact Details.</span>
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  Mobile Money Network *
                </label>
                <select
                  name="paymentChannel"
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as "13" | "6" | "7")}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-colors"
                >
                  <option value="13">MTN Mobile Money</option>
                  <option value="6">Telecel Cash</option>
                  <option value="7">AT Money</option>
                </select>
                <p className="text-[10px] text-[#8C827A] mt-1">Choose the network linked to the phone number above.</p>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  required
                  placeholder="House/Apartment number, Street name, Landmark"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                />
              </div>

              {/* City / Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  City / Region in Ghana *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] focus:outline-none focus:border-[#1C1917] transition-colors"
                >
                  <option value="Accra">Greater Accra (Accra, Tema, East Legon, Cantonments)</option>
                  <option value="Kumasi">Kumasi (Ashanti Region)</option>
                  <option value="Takoradi">Sekondi-Takoradi (Western Region)</option>
                  <option value="Cape Coast">Cape Coast (Central Region)</option>
                  <option value="Tamale">Tamale (Northern Region)</option>
                  <option value="Sunyani">Sunyani (Bono Region)</option>
                  <option value="Koforidua">Koforidua (Eastern Region)</option>
                  <option value="Other Ghana Location">Other Location in Ghana</option>
                </select>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A443F] mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Gate code, landmark notes, or special delivery preferences..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F4] border border-[#DDD6CD] rounded-xl px-4 py-3 text-sm text-[#1C1917] placeholder-[#A89F95] focus:outline-none focus:border-[#1C1917] transition-colors"
                />
              </div>

              {/* Pay With Moolre Action */}
              <div className="pt-6 border-t border-[#EFE9E2] space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending payment request...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatGhs(total)} via Mobile Money</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#78716C] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>You will receive a Mobile Money prompt on your phone.</span>
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
                <span>Doorstep Delivery (Ghana)</span>
                <span className="font-semibold text-[#1C1917]">{formatGhs(deliveryFee)}</span>
              </div>
              <div className="pt-3 border-t border-[#EFE9E2] flex justify-between text-base font-bold text-[#1C1917]">
                <span>Total Due</span>
                <span>{formatGhs(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
