"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import { formatGhs } from "@/lib/paystack";
import { Package, ArrowLeft, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function OrderHistoryPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        setOrders([]);
      } finally {
        setIsFetching(false);
      }
    };

    if (user) {
      fetchOrders();
    } else if (!isLoading) {
      setIsFetching(false);
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-[#EFE9E2]">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
            PURCHASE ARCHIVES
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1C1917]">
            Your Previous <span className="italic font-serif-luxury">Orders.</span>
          </h1>
        </div>

        {/* Orders list */}
        {isFetching ? (
          <div className="py-20 text-center text-xs text-[#78716C]">
            Retrieving your order records...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#ECE5DD] p-8 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#8C827A] mb-4">
              <Package className="w-8 h-8 text-[#C59B4B]" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-normal text-[#1C1917] mb-2">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-6">
              When you purchase our perfumes or gift sets, your confirmed orders and receipts
              will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#38332E]"
            >
              Discover Fragrances
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ECE5DD] p-6 sm:p-8 shadow-2xs space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EFE9E2] text-xs">
                  <div>
                    <span className="font-bold text-[#1C1917] text-sm sm:text-base">
                      {order.orderNumber}
                    </span>
                    <p className="text-[#8C827A] text-[11px] mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-GH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "PAID"
                          ? "bg-[#ECFDF5] text-[#065F46]"
                          : order.status === "DELIVERED"
                          ? "bg-[#EFF6FF] text-[#1E40AF]"
                          : order.status === "SHIPPED"
                          ? "bg-[#F5F3FF] text-[#5B21B6]"
                          : "bg-[#FEF3C7] text-[#92400E]"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="text-[10px] bg-[#FAF7F4] border border-[#EDE7DF] px-2.5 py-1 rounded-full text-[#4A443F]">
                      Ref: {order.paymentReference}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-[#F5EFEB]">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="w-12 h-14 bg-[#FAF7F4] rounded-lg relative overflow-hidden shrink-0 border border-[#EDE7DF]">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-serif-luxury text-sm font-semibold text-[#1C1917]">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-[#8C827A]">
                            Qty: {item.quantity} • {item.size || "50ml"}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-[#1C1917]">
                        {formatGhs(item.productPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total and Delivery Footnote */}
                <div className="pt-4 border-t border-[#EFE9E2] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                  <div className="text-[#78716C]">
                    <span>Delivered to: <strong>{order.deliveryAddress}, {order.city}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-sm font-bold text-[#1C1917]">
                      Total: {formatGhs(order.totalAmount)}
                    </span>
                    <span className="text-[11px] text-[#10B981] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Paid with Moolre
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
