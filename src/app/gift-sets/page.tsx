import React from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts, prisma } from "@/lib/db";
import { Gift, Sparkles, ShieldCheck } from "lucide-react";


export const dynamic = "force-dynamic";
export const metadata = {
  title: "Artisanal Gift Sets & Coffrets | Aura & Aether Parfums",
  description:
    "Explore luxury presentation coffrets, travel atomizers, and curated fragrance sets from Aura & Aether Parfums.",
};

export default async function GiftSetsPage() {
  const [giftSets, settingsRows] = await Promise.all([
    getProducts({ giftSets: true }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value])) as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#E8DEC0] text-[#9B7036] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>{settings.giftSetsEyebrow || "GIFT WITH MEANING"}</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917]">
            {settings.giftSetsTitle || "Gift Sets"}
          </h1>
          <p className="mt-3 text-sm text-[#6B635B] font-light leading-relaxed">
            {settings.giftSetsDescription || "Discover thoughtful fragrance gifts made for celebrations, everyday moments, and people you love."}
          </p>
        </div>

        {/* Gift Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {giftSets.map((set) => (
            <ProductCard key={set.id} product={set} />
          ))}
        </div>

        {/* Gift Service Highlights */}
        <div className="mt-20 p-8 sm:p-10 bg-white rounded-3xl border border-[#ECE5DD] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-[#1C1917]">
                Complimentary Gift Wrapping
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Every coffret includes luxury silk ribbon, protective inner foam, and a hand-written note.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-[#1C1917]">
                Discovery Travel Formats
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                TSA-compliant pocket atomizers engineered for fine mist dispersion on the move.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EE] text-[#C59B4B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-[#1C1917]">
                Nationwide Courier Care
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Shock-tested protective packaging ensures your flacons arrive in pristine condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
