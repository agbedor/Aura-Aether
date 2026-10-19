import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories, prisma } from "@/lib/db";
import { SlidersHorizontal } from "lucide-react";


export const dynamic = "force-dynamic";
interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "name";
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "";
  const currentSort = params.sort || "newest";
  const searchQuery = params.search || "";

  const [categories, products, settingsRows] = await Promise.all([
    getCategories(),
    getProducts({
      category: currentCategory || undefined,
      sort: currentSort,
      search: searchQuery || undefined,
      giftSets: false,
    }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value])) as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8C827A] block mb-2">
            {settings.shopEyebrow || "THE COLLECTION"}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917]">
            {settings.shopTitle || "Find your fragrance."}
          </h1>
          <p className="mt-3 text-sm text-[#6B635B] font-light leading-relaxed">
            {settings.shopDescription || "Explore scents for every mood, moment, and personal signature."}
          </p>
        </div>

        {/* Filter and Sorting Controls */}
        <div className="bg-white border border-[#EFE9E2] rounded-2xl p-4 mb-10 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
              href="/shop"
              className={`text-xs px-4 py-2 rounded-full font-medium transition-colors ${
                !currentCategory
                  ? "bg-[#1C1917] text-[#FAF8F5]"
                  : "bg-[#FAF7F5] text-[#5C554F] hover:bg-[#F2ECE4] hover:text-[#1C1917]"
              }`}
            >
              All Fragrances
            </Link>
            {categories
              .filter((c) => c.slug !== "gift-sets")
              .map((cat) => {
                const isSelected = currentCategory === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}&sort=${currentSort}`}
                    className={`text-xs px-4 py-2 rounded-full font-medium transition-colors ${
                      isSelected
                        ? "bg-[#1C1917] text-[#FAF8F5]"
                        : "bg-[#FAF7F5] text-[#5C554F] hover:bg-[#F2ECE4] hover:text-[#1C1917]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#5C554F]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C827A]" />
            <span className="font-medium">Sort:</span>
            <div className="flex items-center gap-1">
              {[
                { label: "Newest", value: "newest" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "A - Z", value: "name" },
              ].map((sortOption) => (
                <Link
                  key={sortOption.value}
                  href={`/shop?${currentCategory ? `category=${currentCategory}&` : ""}sort=${sortOption.value}`}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                    currentSort === sortOption.value
                      ? "font-bold text-[#1C1917] bg-[#F2ECE4]"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  {sortOption.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex justify-between items-center text-xs text-[#8C827A]">
          <p>
            Showing <strong className="text-[#1C1917]">{products.length}</strong> handcrafted perfumes
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <Link href="/gift-sets" className="text-[#9B7036] hover:underline font-medium">
            Looking for gift sets? Browse coffrets →
          </Link>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#ECE5DD] p-8">
            <h3 className="font-serif-luxury text-2xl font-normal text-[#1C1917] mb-2">
              No fragrances found
            </h3>
            <p className="text-sm text-[#78716C] max-w-sm mx-auto mb-6">
              We couldn&apos;t find any perfumes matching this filter. Try clearing filters or exploring our other collections.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-full bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#38332E]"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
