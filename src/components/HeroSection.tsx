"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

type HeroContent = { heroTitle: string; heroDescription: string; motto: string };
const defaults: HeroContent = {
  heroTitle: "Find your signature scent.",
  heroDescription: "Explore fragrances that capture your mood, express your individuality, and leave a lasting impression.",
  motto: "Your scent. Your signature.",
};

const categories = [
  { label: "For Her", href: "/shop?category=women" },
  { label: "For Him", href: "/shop?category=men" },
  { label: "Unisex", href: "/shop?category=unisex" },
  { label: "Gift Sets", href: "/gift-sets" },
];

export default function HeroSection() {
  const [content, setContent] = useState<HeroContent>(defaults);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setContent((current) => ({ ...current, ...data.settings }));
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="bg-[#FFF0F6] text-[#17110F]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-7 lg:px-12 pt-5 sm:pt-8">
        <div className="relative overflow-hidden min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] grid lg:grid-cols-2 bg-[#F7DDE7]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-20">
            <div className="inline-flex items-center gap-2 self-start border border-[#D9A17E]/60 bg-white/55 px-3 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#765344]">
              <Sparkles className="w-3.5 h-3.5" />
              Aura &amp; Aether Parfums
            </div>
            <h1 className="font-serif-luxury mt-7 text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[0.98] tracking-[-0.04em] font-normal max-w-xl">
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-md text-sm sm:text-base leading-7 text-[#65534D]">
              {content.heroDescription}
            </p>
            <p className="mt-4 font-serif-luxury italic text-lg sm:text-xl text-[#9C674D]">
              {content.motto}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-[#17110F] px-7 py-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#77513F]">
                Shop all fragrances <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 border border-[#B77F60] bg-white/35 px-7 py-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B2922] transition-colors hover:bg-white/75">
                Discover our story <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#765D51]">
              <span>Find your everyday scent</span>
              <span className="text-[#B77F60]">•</span>
              <span>Make every moment yours</span>
            </div>
          </div>

          <div className="relative min-h-[340px] sm:min-h-[430px] lg:min-h-full overflow-hidden bg-[#E8C2B0]">
            <Image
              src="/images/hero-editorial.svg"
              alt="Aura & Aether Parfums signature fragrance and botanical inspiration"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17110F]/35 via-transparent to-white/5" />
            <div className="absolute left-5 right-5 bottom-5 sm:left-8 sm:right-8 sm:bottom-8 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-2">The fragrance edit</p>
                <p className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl leading-tight">A little luxury,<br />every day.</p>
              </div>
              <Link href="/shop" aria-label="Browse fragrances" className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#17110F] grid place-items-center hover:bg-[#B2B84D] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="absolute top-5 right-5 sm:top-8 sm:right-8 border border-white/70 bg-white/85 backdrop-blur-sm px-4 py-3 text-center text-[#17110F]">
              <span className="block font-serif-luxury text-xl sm:text-2xl">A&amp;A</span>
              <span className="block text-[8px] uppercase tracking-[0.2em]">Signature scents</span>
            </div>
          </div>
        </div>

        <nav aria-label="Shop fragrance categories" className="grid grid-cols-2 sm:grid-cols-4 border-x border-b border-[#E9CFD9]">
          {categories.map((category, index) => (
            <Link key={category.label} href={category.href} className={`group flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-white/55 hover:bg-white transition-colors ${index !== 0 ? "sm:border-l border-[#E9CFD9]" : ""} ${index > 1 ? "border-t sm:border-t-0 border-[#E9CFD9]" : ""}`}>
              <span className="font-serif-luxury text-base sm:text-lg">{category.label}</span>
              <ArrowRight className="w-4 h-4 text-[#B77F60] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8 bg-[#B2B84D] px-4 py-3 text-center text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#292516]">
        Discover your next favourite fragrance · Your scent. Your signature.
      </div>
    </section>
  );
}
