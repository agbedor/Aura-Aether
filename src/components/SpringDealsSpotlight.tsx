"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";

export default function SpringDealsSpotlight() {
  const [content, setContent] = useState({ title: "Find your next signature", description: "Explore fragrances for every mood, moment, and version of you." });

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.ok ? res.json() : null).then((data) => {
      if (data?.settings) setContent((current) => ({ title: data.settings.homePromoTitle || current.title, description: data.settings.homePromoDescription || current.description }));
    }).catch(() => undefined);
  }, []);

  return (
    <section className="bg-white py-20 lg:py-24 border-y border-[#EFE9E2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Peonies & Crystal Perfume Composition matching Reference 1 */}
          <div className="lg:col-span-7 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden bg-[#FAF7F5] border border-[#ECE5DD] shadow-sm">
              <Image
                src="/images/spring-peonies.svg"
                alt="Spring Peonies and Aura & Aether Perfume Flacons"
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#E7DFD5] text-[10px] uppercase font-bold tracking-widest text-[#1C1917] flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-[#E86A5D]" />
                <span>Curated Botanicals</span>
              </div>
            </div>
          </div>

          {/* Right: Typography and Salmon/Coral CTA matching Reference 1 */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6 max-w-lg mx-auto lg:mx-0">
            {/* Eyebrow */}
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C827A] block">
              AURA & AETHER
            </span>

            {/* Heading matching Reference 1 */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] leading-tight uppercase tracking-tight">
              {content.title}
            </h2>

            {/* Paragraph matching Reference 1 */}
            <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed font-light">
              {content.description}
            </p>

            {/* Coral/Salmon CTA button matching Reference 1 */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl sm:rounded-2xl bg-[#B77F60] hover:bg-[#8E5E45] text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
