"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type HeroContent = {
  heroTitle: string;
  heroDescription: string;
  motto: string;
  heroImageUrl?: string;
  heroCtaLabel: string;
};

const defaults: HeroContent = {
  heroTitle: "Aura & Aether",
  heroDescription: "Fragrance that says something about you. Find the scent that feels like yours.",
  motto: "PARFUMS · Your scent. Your signature.",
  heroImageUrl: "/images/hero-editorial.svg",
  heroCtaLabel: "Explore the collection",
};

const categories = [
  { label: "Shop All", href: "/shop" },
  { label: "For Her", href: "/shop?category=women" },
  { label: "For Him", href: "/shop?category=men" },
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
    <section className="bg-[#FCFBF9] text-[#17110F]">
      <div className="relative isolate min-h-[620px] sm:min-h-[700px] lg:min-h-[min(780px,calc(100vh-112px))] overflow-hidden bg-[#2A211D]">
        <Image
          src={content.heroImageUrl || "/images/hero-editorial.svg"}
          alt="Fragrance imagery for Aura & Aether Parfums"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17110F]/75 via-[#17110F]/35 to-[#17110F]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17110F]/55 via-transparent to-[#17110F]/10" />

        <div className="relative z-10 flex min-h-[620px] sm:min-h-[700px] lg:min-h-[min(780px,calc(100vh-112px))] items-center justify-center px-5 py-20 sm:px-10 lg:px-16">
          <div className="w-full max-w-6xl text-center text-white">
            <p className="mb-5 text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#E8BD9E]">
              A signature in every note
            </p>
            <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(5rem,10vw,10rem)] leading-[0.9] font-normal tracking-[-0.055em] drop-shadow-lg">
              {content.heroTitle}
            </h1>
            <p className="font-serif-luxury mt-4 text-lg sm:text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#F0C8A9]">
              Parfums
            </p>
            <div className="mx-auto mt-7 h-px w-16 bg-[#C58A63]" />
            <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base leading-7 text-white/90">
              {content.heroDescription}
            </p>
            <p className="font-serif-luxury mt-4 text-base sm:text-lg italic text-[#F0C8A9]">
              {content.motto}
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-4 border border-[#E8BD9E] bg-[#17110F]/30 px-7 py-4 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors hover:bg-[#B77F60] hover:border-[#B77F60]"
            >
              {content.heroCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 text-[9px] uppercase tracking-[0.28em] text-white/75 sm:bottom-8 sm:left-10">
          Discover your signature
        </div>
        <div className="absolute bottom-5 right-5 z-10 text-[9px] uppercase tracking-[0.28em] text-white/75 sm:bottom-8 sm:right-10">
          Est. Aura & Aether
        </div>
      </div>

      <nav aria-label="Shop fragrance categories" className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#E8D9CE]">
        {categories.map((category, index) => (
          <Link
            key={category.label}
            href={category.href}
            className={`group flex items-center justify-between gap-3 bg-[#FCFBF9] px-5 py-4 sm:px-8 sm:py-5 transition-colors hover:bg-[#F5E8DF] ${index > 0 ? "sm:border-l border-[#E8D9CE]" : ""} ${index > 1 ? "border-t sm:border-t-0 border-[#E8D9CE]" : ""}`}
          >
            <span className="font-serif-luxury text-base sm:text-lg">{category.label}</span>
            <ArrowRight className="h-4 w-4 text-[#B77F60] transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
