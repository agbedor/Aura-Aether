import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/db";
import { formatGhs } from "@/lib/paystack";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ShieldCheck, Truck, ArrowLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Aura & Aether" };

  return {
    title: `${product.name} | Aura & Aether Parfums`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Aura & Aether Parfums`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts({ featured: true }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fragrance Catalog</span>
          </Link>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Product Image & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/5 w-full bg-white rounded-3xl border border-[#ECE5DD] overflow-hidden p-8 shadow-sm flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain p-8 hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {product.isSale && (
                <span className="absolute top-6 left-6 bg-[#DFC07D] text-[#1C1917] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
                  SPECIAL OFFER
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#78716C] px-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B4B]" />
                Cold-Pressed Botanical Extraction
              </span>
              <span>Batch Distilled</span>
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-2">
                {product.scentNotes}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917] leading-tight">
                {product.name}
              </h1>

              {/* Price & Size */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                  {formatGhs(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#A89F95] line-through font-normal">
                    {formatGhs(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-medium text-[#78716C] ml-2">
                  Tax included. Size: {product.size}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#5C554F] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Interactive Add to Cart & Quantity (Client Component) */}
            <ProductDetailClient product={product} />

            {/* Olfactory Notes Pyramid */}
            {(product.topNotes || product.heartNotes || product.baseNotes) && (
              <div className="border-t border-b border-[#EFE9E2] py-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1C1917]">
                  Olfactory Notes Architecture
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {product.topNotes && (
                    <div className="p-3 bg-white rounded-xl border border-[#EDE7DF]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7036] block mb-1">
                        Top Notes
                      </span>
                      <p className="text-[#38332E] leading-snug">{product.topNotes}</p>
                    </div>
                  )}
                  {product.heartNotes && (
                    <div className="p-3 bg-white rounded-xl border border-[#EDE7DF]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7036] block mb-1">
                        Heart Notes
                      </span>
                      <p className="text-[#38332E] leading-snug">{product.heartNotes}</p>
                    </div>
                  )}
                  {product.baseNotes && (
                    <div className="p-3 bg-white rounded-xl border border-[#EDE7DF]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7036] block mb-1">
                        Base Notes
                      </span>
                      <p className="text-[#38332E] leading-snug">{product.baseNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-xs text-[#5C554F]">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#ECE5DD]">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Paystack Verified Payment</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#ECE5DD]">
                <Truck className="w-4 h-4 text-[#C59B4B] shrink-0" />
                <span>Ghana Doorstep Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Fragrances */}
        <div className="mt-24 pt-16 border-t border-[#EFE9E2]">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-1">
              COMPLEMENTARY CREATIONS
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917]">
              You May Also <span className="italic font-serif-luxury">Adore.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
