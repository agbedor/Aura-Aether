import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import PressLogos from "@/components/PressLogos";
import SpringDealsSpotlight from "@/components/SpringDealsSpotlight";
import ProductCard from "@/components/ProductCard";
import { getProducts, prisma } from "@/lib/db";


export default async function HomePage() {
  const [featuredProducts, giftSets, settingsRows] = await Promise.all([
    getProducts({ featured: true, giftSets: false }),
    getProducts({ giftSets: true }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value])) as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* 1. Hero Section matching Reference 2 */}
      <HeroSection />

      {/* 2. Press Logos matching Reference 2 */}
      <PressLogos />

      {/* 3. Featured Fragrances Grid matching Reference 2 */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 text-center sm:text-left gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
              {settings.homeFeaturedEyebrow || "OUR COLLECTION"}
            </span>
            {/* Title matching Reference 2: "Featured fragrances." with italic serif touch */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-normal">
              {settings.homeFeaturedTitle || "Featured fragrances."}
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#1C1917] hover:text-[#9B7036] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Fragrances</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid matching Reference 2: 4 cards across on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Spring Deals Spotlight matching Reference 1 */}
      <SpringDealsSpotlight />

      {/* 5. Curated Gift Sets & Coffrets Showcase */}
      <section className="py-20 lg:py-24 bg-[#FAF7F3] border-b border-[#EFE9E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-2">
              PRESENTATION COFFRETS
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-normal">
              {settings.homeGiftTitle || "Curated Gift Sets."}
            </h2>
            <p className="mt-3 text-sm text-[#6B635B] font-light leading-relaxed">
              Hand-assembled coffrets and travel atomizers crafted for discerning collectors and
              memorable moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {giftSets.slice(0, 3).map((gift) => (
              <ProductCard key={gift.id} product={gift} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gift-sets"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#1C1917] text-xs font-bold uppercase tracking-widest text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF8F5] transition-all"
            >
              <span>Explore All Coffrets &amp; Sets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Brand Values & Guarantees */}
      <section className="py-16 bg-white border-b border-[#EFE9E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="p-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                Rare Raw Essences
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Cold-pressed Grasse blossoms, wild clover, and ethically sourced oud resins.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                Cruelty Free &amp; Clean
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Formulated without parabens or phthalates. Completely vegan and skin-kind.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                Paystack Protected
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                256-bit bank grade encryption for debit/credit cards and Mobile Money.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917]">
                Ghana Nationwide Delivery
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Swift doorstep dispatch across Accra, Kumasi, Takoradi, and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
