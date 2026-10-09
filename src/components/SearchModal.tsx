"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { formatGhs } from "@/lib/paystack";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.products || []);
          }
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Fragrances"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm transition-opacity"
    >
      <div className="bg-[#FAF8F5] border border-[#EBE4DC] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-[#EBE4DC] bg-white">
          <Search className="w-5 h-5 text-[#8C827A] mr-3" />
          <input
            type="text"
            placeholder="Search by perfume name, accord, or notes (e.g. Amber, Rose, Oud)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-[#1C1917] placeholder-[#A89F95] text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-[#8C827A] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#EFE9E2]">
          {isLoading && (
            <p className="text-center py-8 text-sm text-[#8C827A]">Searching perfumes...</p>
          )}

          {!isLoading && query.trim().length > 1 && results.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-[#1C1917]">No fragrances found for &quot;{query}&quot;</p>
              <p className="text-xs text-[#8C827A] mt-1">Try searching for &quot;Oud&quot;, &quot;Floral&quot;, or &quot;Meadow&quot;</p>
            </div>
          )}

          {!isLoading &&
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  router.push(`/shop/${product.slug}`);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 relative bg-[#F5EFEB] rounded-lg overflow-hidden shrink-0 border border-[#EAE3D9]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base font-semibold text-[#1C1917] group-hover:text-[#9B7036] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] tracking-wider text-[#8C827A] uppercase">
                      {product.scentNotes} • {product.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#1C1917]">
                    {formatGhs(product.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8C827A] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}

          {!query && (
            <div className="py-6 px-4 text-center">
              <p className="text-xs uppercase tracking-widest text-[#8C827A] mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Meadow", "Velvet Oud", "Jardinea", "Amber Bloom", "Gift Sets"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E5DDD4] text-[#4A443F] hover:border-[#1C1917] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
