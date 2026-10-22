import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import SpringDealsSpotlight from "@/components/SpringDealsSpotlight";
import ProductCard from "@/components/ProductCard";
import { getProducts, prisma } from "@/lib/db";



export const dynamic = "force-dynamic";
export default async function HomePage() {
  const [featuredProducts, settingsRows] = await Promise.all([
    getProducts({ featured: true, giftSets: false }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value])) as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* 1. Hero Section matching Reference 2 */}
      <HeroSection />

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
            <span>{settings.homeFeaturedCtaLabel || "View All Fragrances"}</span>
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

      {/* 5. Customer testimonials */}
      <section className="py-20 lg:py-24 bg-[#FAF7F3] border-y border-[#EFE9E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-2">
              NOTES FROM OUR COMMUNITY
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-normal">
              A scent worth remembering.
            </h2>
            <p className="mt-3 text-sm text-[#6B635B] font-light leading-relaxed">
              Every fragrance becomes part of a story. We look forward to sharing our customers’ experiences here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "The perfect fragrance is the one that feels like it was made for you.", label: "Customer story placeholder" },
              { quote: "A beautiful scent can turn an ordinary moment into a memory.", label: "Customer story placeholder" },
              { quote: "Finding your signature scent should feel personal, thoughtful, and effortless.", label: "Customer story placeholder" },
            ].map((testimonial, index) => (
              <article key={index} className="group rounded-2xl border border-[#E8DED5] bg-white p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6B4B3E]/5">
                <div aria-label="Decorative stars" className="text-[#B77F60] tracking-[0.2em] text-sm">★★★★★</div>
                <p className="mt-5 font-serif-luxury text-xl leading-relaxed text-[#2A211D]">“{testimonial.quote}”</p>
                <div className="mt-7 border-t border-[#EFE9E2] pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C827A]">{testimonial.label}</p>
                  <p className="mt-1 text-xs text-[#9A918A]">Replace with a verified customer review</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
