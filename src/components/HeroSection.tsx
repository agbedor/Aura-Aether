"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFF0F6] border-b border-[#F0DCE5]">
      <div className="absolute inset-0 opacity-35 pointer-events-none">
        <Image src="/images/hero-editorial.svg" alt="" fill priority className="object-cover object-center mix-blend-multiply" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#8B6658] mb-5 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#D9A17E]" /> Artistry in every drop
            </p>
            <h1 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.98] tracking-[-0.045em] text-[#17110F] font-normal">
              Your scent.<br />
              <span className="italic text-[#B77F60]">Your signature.</span>
            </h1>
            <p className="mt-7 text-sm sm:text-base leading-7 text-[#65534D] max-w-lg mx-auto lg:mx-0">
              Discover fragrances that feel like you. Find your signature scent, mark a moment, and leave a little magic wherever you go.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-[#17110F] text-white px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-[#B77F60] transition-colors">
                Explore fragrances <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center border border-[#CFA58F] text-[#3B2922] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-white/70 transition-colors">
                Our story
              </Link>
            </div>
            <p className="mt-8 font-serif-luxury italic text-lg text-[#8B6658]">Aura &amp; Aether Parfums</p>
          </div>
          <div className="relative max-w-xl mx-auto w-full">
            <div className="absolute -inset-4 border border-[#DDB69F] translate-x-2 translate-y-2" />
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden bg-[#E9D8CD]">
              <Image src="/images/hero-editorial.svg" alt="An editorial still life for Aura & Aether Parfums" fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[9px] uppercase tracking-[0.3em] mb-2">The art of fragrance</p>
                <p className="font-serif-luxury text-3xl sm:text-4xl leading-tight">A feeling that stays.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-[#B2B84D] text-[#292516] py-3 text-center text-[9px] sm:text-[10px] uppercase tracking-[0.24em]">
        Find the scent that tells your story · Your scent. Your signature.
      </div>
    </section>
  );
}
