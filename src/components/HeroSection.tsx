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
  heroImageUrl2?: string;
  heroImageUrl3?: string;
  heroCtaLabel: string;
  heroCtaUrl: string;
  heroCtaAlignment: string;
};

const defaults: HeroContent = {
  heroTitle: "Aura & Aether",
  heroDescription: "Fragrance that says something about you. Find the scent that feels like yours.",
  motto: "PARFUMS · Your scent. Your signature.",
  heroImageUrl: "/images/hero-placeholder-1.svg",
  heroImageUrl2: "/images/hero-placeholder-2.svg",
  heroImageUrl3: "/images/hero-placeholder-3.svg",
  heroCtaLabel: "Explore the collection",
  heroCtaUrl: "/shop",
  heroCtaAlignment: "center",
};

export default function HeroSection({ initialSettings }: { initialSettings?: Partial<HeroContent> }) {
  const [content] = useState<HeroContent>({ ...defaults, ...initialSettings });
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [content.heroImageUrl || defaults.heroImageUrl!, content.heroImageUrl2 || defaults.heroImageUrl2!, content.heroImageUrl3 || defaults.heroImageUrl3!];
  const alignmentClass = content.heroCtaAlignment === "left" ? "justify-start" : content.heroCtaAlignment === "right" ? "justify-end" : "justify-center";
  const heroCtaHref = content.heroCtaUrl?.startsWith("/") && !content.heroCtaUrl.startsWith("//") ? content.heroCtaUrl : "/shop";
  const alignmentClass = content.heroCtaAlignment === "left" ? "justify-start" : content.heroCtaAlignment === "right" ? "justify-end" : "justify-center";
  const heroCtaHref = content.heroCtaUrl?.startsWith("/") && !content.heroCtaUrl.startsWith("//") ? content.heroCtaUrl : "/shop";

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % 3), 6000);
    return () => window.clearInterval(timer);
  }, []);



  return (
    <section className="bg-[#FCFBF9] text-[#17110F]">
      <div className="relative isolate min-h-[620px] sm:min-h-[700px] lg:min-h-[min(780px,calc(100vh-112px))] overflow-hidden bg-[#2A211D]">
        {slides.map((src, index) => (
          <Image
            key={src + index}
            src={src}
            alt={`Aura & Aether fragrance campaign slide ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover object-center transition-all duration-[1400ms] ease-in-out ${activeSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-[1.035]"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17110F]/75 via-[#17110F]/35 to-[#17110F]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17110F]/55 via-transparent to-[#17110F]/10" />

        <div className="relative z-10 flex min-h-[620px] sm:min-h-[700px] lg:min-h-[min(780px,calc(100vh-112px))] items-center justify-center px-5 py-20 sm:px-10 lg:px-16 animate-fade-up">
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
            <div className={`mt-8 flex ${alignmentClass}`}>
            <Link
              href={heroCtaHref}
              className="aa-button group inline-flex items-center gap-4 border border-[#E8BD9E] bg-[#17110F]/30 px-7 py-4 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors hover:bg-[#B77F60] hover:border-[#B77F60]"
            >
              {content.heroCtaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 text-[9px] uppercase tracking-[0.28em] text-white/75 sm:bottom-8 sm:left-10">
          Discover your signature
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 sm:bottom-8 sm:right-10" aria-label="Hero slides">
          {slides.map((_, index) => <button key={index} type="button" onClick={() => setActiveSlide(index)} aria-label={`Show hero slide ${index + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? "w-8 bg-[#E8BD9E]" : "w-2 bg-white/60 hover:bg-white"}`} />)}
        </div>
      </div>

    </section>
  );
}
