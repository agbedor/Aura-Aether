"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatGhs } from "@/lib/paystack";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, subtotal, deliveryFee, total } =
    useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cart"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EBE4DC] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#EBE4DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#1C1917]" />
              <h2 className="font-serif-luxury text-xl font-semibold text-[#1C1917]">
                Cart
              </h2>
              <span className="text-xs bg-[#F2ECE4] text-[#5C554F] px-2 py-0.5 rounded-full font-medium">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-full hover:bg-[#F5EFEB] text-[#8C827A] hover:text-[#1C1917] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F3ECE5] flex items-center justify-center text-[#8C827A]">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-medium text-[#1C1917]">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-[#8C827A] mt-1 max-w-xs mx-auto">
                    Explore our handcrafted perfumes and artisanal coffrets to begin.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/shop");
                  }}
                  className="aa-button inline-block mt-4 text-xs font-semibold uppercase tracking-widest px-6 py-3 bg-[#1C1917] text-[#FAF8F5] rounded-full hover:bg-[#38332E] transition-colors"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white border border-[#ECE5DD] rounded-xl p-4 flex gap-4 shadow-2xs hover:border-[#DFC07D] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F8F5F1] rounded-lg shrink-0 relative overflow-hidden border border-[#EDE7DF]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif-luxury text-base font-semibold text-[#1C1917] hover:text-[#9B7036] transition-colors leading-tight"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-[#A89F95] hover:text-[#B91C1C] transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] tracking-wider uppercase text-[#8C827A] mt-0.5">
                        {item.scentNotes || item.size}
                      </p>
                      <p className="text-sm font-semibold text-[#1C1917] mt-1">
                        {formatGhs(item.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5EFEB]">
                      <div className="flex items-center border border-[#DDD6CE] rounded-full px-2 py-0.5 bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1 text-[#5C554F] hover:text-black disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1 text-[#5C554F] hover:text-black disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-medium text-[#78716C]">
                        Subtotal: {formatGhs(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#EBE4DC] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1C1917]">{formatGhs(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Standard Nationwide Delivery</span>
                  <span className="font-medium text-[#1C1917]">{formatGhs(deliveryFee)}</span>
                </div>
                <div className="border-t border-[#EFE9E2] pt-2 flex justify-between text-base font-semibold text-[#1C1917]">
                  <span>Estimated Total</span>
                  <span>{formatGhs(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  className="aa-button w-full py-3.5 px-6 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#36322E] flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/cart");
                  }}
                  className="w-full py-2.5 px-6 rounded-full border border-[#D5CDC4] text-xs font-semibold uppercase tracking-widest text-[#5C554F] hover:bg-[#F7F2ED] transition-colors"
                >
                  View Cart
                </button>
              </div>

              <p className="text-[11px] text-center text-[#8C827A]">
                🔒 Secure encrypted checkout with Paystack
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
