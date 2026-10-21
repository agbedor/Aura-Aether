"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatGhs } from "@/lib/paystack";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isInCart = items.some((item) => item.productId === product.id);

  return (
    <div className="group animate-fade-up bg-white rounded-2xl border border-[#ECE5DD] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D9CDBF] relative">
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 items-end">
        {product.originalPrice != null && product.originalPrice > product.price && (
          <span className="bg-[#9B2C2C] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        )}
        {product.isSale && !(product.originalPrice != null && product.originalPrice > product.price) && (
          <span className="bg-[#DFC07D] text-[#1C1917] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
            ON SALE
          </span>
        )}
        {product.isFeatured && !product.isSale && !(product.originalPrice != null && product.originalPrice > product.price) && (
          <span className="bg-[#1C1917] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs">
            SIGNATURE
          </span>
        )}
        {!product.inStock && (
          <span className="bg-[#EF4444] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Image Container matching Reference 2 proportions */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative w-full aspect-square bg-[#FCFAF7] rounded-xl overflow-hidden mb-4 group-hover:bg-[#F8F4EE] transition-colors"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Product Information */}
      <div className="text-center pt-1 pb-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#1C1917] hover:text-[#9B7036] transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C827A] uppercase mt-1">
            {product.scentNotes}
          </p>
        </div>

        {/* Price & Size */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-base font-semibold text-[#1C1917]">
            {formatGhs(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#A89F95] line-through font-normal">
              {formatGhs(product.originalPrice)}
            </span>
          )}
          <span className="text-[10px] text-[#A89F95] uppercase ml-1">
            ({product.size})
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-[#F5EFEB] flex items-center gap-2">
        <button
          onClick={() => addItem(product, 1)}
          disabled={!product.inStock}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
            !product.inStock
              ? "bg-[#E5DDD4] text-[#A89F95] cursor-not-allowed"
              : isInCart
              ? "bg-[#4B5945] text-white hover:bg-[#3E4A39]"
              : "bg-[#1C1917] text-[#FAF8F5] hover:bg-[#38332E]"
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <Link
          href={`/shop/${product.slug}`}
          className="p-2.5 rounded-full border border-[#D5CDC4] text-[#5C554F] hover:text-black hover:border-[#1C1917] transition-colors"
          title="View product details"
        >
          <span className="sr-only">Details</span>
          <span className="text-xs font-medium px-1">View</span>
        </Link>
      </div>
    </div>
  );
}
