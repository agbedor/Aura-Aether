"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF6F2] py-20 lg:py-28 border-b border-[#EFE9E2]">
      {/* Background Editorial Visual */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
        <Image
          src="/images/hero-editorial.svg"
          alt="Aura & Aether Botanical Parfums"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E7DFD5] text-[#5C554F] text-[11px] font-semibold uppercase tracking-widest mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
            <span>Artisanal Ghanaian Luxury Parfums</span>
          </div>

          {/* Headline matching Reference 2: "Elevate everyday moments to extraordinary." */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] leading-[1.15] tracking-tight">
            Elevate everyday moments to{" "}
            <span className="italic font-serif-luxury font-normal text-[#38332E]">
              extraordinary.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#6B635B] font-light leading-relaxed max-w-xl">
            Immerse yourself in Aura &amp; Aether&apos;s haute perfumery. Each flacon is
            meticulously distilled from cold-pressed botanical essences, rare resins, and
            timeless olfactory accords.
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 justify-start">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#38332E] transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Shop Our Fragrances</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/gift-sets"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/90 border border-[#DDD6CD] text-[#292524] text-xs font-semibold uppercase tracking-widest hover:bg-white hover:border-[#1C1917] transition-all duration-200 shadow-2xs text-center"
            >
              Explore Gift Sets
            </Link>
          </div>

          {/* Fast perks line */}
          <div className="mt-12 pt-8 border-t border-[#EAE3D9] flex flex-wrap gap-6 text-[11px] uppercase tracking-wider text-[#78716C]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />
              <span>Authentic Rare Essences</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />
              <span>Nationwide Ghana Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />
              <span>Paystack Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
