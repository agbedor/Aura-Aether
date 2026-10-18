"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingCart, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGhs } from "@/lib/paystack";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FCFBF9] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-[#ECE5DD] shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#8C827A] mb-4">
            <ShoppingCart className="w-8 h-8 text-[#C59B4B]" />
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1917] mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-[#78716C] mb-8 font-light leading-relaxed">
            Discover our artisanal perfumes and limited-edition gift coffrets to begin your
            sensory voyage.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#38332E] transition-all shadow-md"
          >
            <span>Explore Fragrance Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#EFE9E2]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
              CURRENT SELECTIONS
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1C1917]">
              Shopping <span className="italic font-serif-luxury">Bag.</span>
            </h1>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </Link>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-[#ECE5DD] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs hover:border-[#D5CDC4] transition-colors"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-24 sm:w-24 sm:h-28 bg-[#FAF7F4] rounded-xl relative overflow-hidden shrink-0 border border-[#EDE7DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-serif-luxury text-lg sm:text-xl font-semibold text-[#1C1917] hover:text-[#9B7036] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-[#8C827A] uppercase">
                      {item.scentNotes || item.size}
                    </p>
                    <p className="text-sm font-semibold text-[#1C1917]">
                      {formatGhs(item.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity & Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#F5EFEB]">
                  <div className="flex items-center border border-[#D5CDC4] rounded-full px-3 py-1 bg-[#FCFAF7]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-[#5C554F] hover:text-black disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#1C1917]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 text-[#5C554F] hover:text-black disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-24">
                    <span className="text-sm font-bold text-[#1C1917]">
                      {formatGhs(item.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="p-2 text-[#A89F95] hover:text-[#B91C1C] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#ECE5DD] p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h2 className="font-serif-luxury text-xl font-semibold text-[#1C1917] pb-4 border-b border-[#EFE9E2]">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-[#5C554F]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1C1917]">{formatGhs(subtotal)}</span>
              </div>
              <div className="rounded-xl bg-[#FAF7F3] p-3 text-[11px] leading-5 text-[#6B635B]">
                We will call to confirm your delivery location and Uber delivery cost after your order. No delivery fee is added here.
              </div>
              <div className="pt-3 border-t border-[#EFE9E2] flex justify-between text-base font-bold text-[#1C1917]">
                <span>Total Amount</span>
                <span>{formatGhs(total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="block text-center text-xs text-[#78716C] hover:text-[#1C1917] py-2 transition-colors"
              >
                Add more items
              </Link>
            </div>

            <div className="pt-4 border-t border-[#EFE9E2] flex items-center justify-center gap-2 text-[11px] text-[#78716C]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Payments verified securely via Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
