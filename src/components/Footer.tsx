"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-12 border-t border-[#292524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#2E2A27]">
          {/* Column 1: Brand & Paystack trust badge (2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl font-semibold tracking-[0.25em] text-white block uppercase">
                AURA &amp; AETHER
              </span>
              <span className="font-sans-clean text-[9px] tracking-[0.4em] font-medium text-[#A89F95] uppercase block -mt-1">
                PARFUMS D&apos;EXCEPTION
              </span>
            </Link>
            <p className="text-xs text-[#A89F95] leading-relaxed max-w-sm font-light">
              Artisanal luxury perfumery handcrafted with precious botanical extracts,
              cold-pressed blossoms, and rare resins. Designed to elevate the senses and linger
              with timeless elegance.
            </p>

            {/* Paystack Payment Trust Badge */}
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#292524] border border-[#3E3834] text-[11px] text-[#D6CEBE]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Secured by <strong>Paystack</strong></span>
              </div>
              <span className="text-[11px] text-[#A89F95]">🇬🇭 Ghana Delivery</span>
            </div>
          </div>

          {/* Column 2: Fragrances */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              Fragrances
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A89F95]">
              <li>
                <Link href="/shop?category=floral" className="hover:text-white transition-colors">
                  Floral Symphonies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fresh" className="hover:text-white transition-colors">
                  Fresh &amp; Citrus Accords
                </Link>
              </li>
              <li>
                <Link href="/shop?category=woody" className="hover:text-white transition-colors">
                  Woody &amp; Earthy Resins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=amber-spice" className="hover:text-white transition-colors">
                  Amber &amp; Spiced Accords
                </Link>
              </li>
              <li>
                <Link href="/gift-sets" className="hover:text-white transition-colors">
                  Curated Gift Coffrets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A89F95]">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Boutique
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-white transition-colors">
                  Fragrance Consultation FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
              The Scent Circle
            </h4>
            <p className="text-xs text-[#A89F95] mb-3 font-light leading-relaxed">
              Subscribe for private release invitations and rare extraction batches.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#10B981] bg-[#292524] p-2.5 rounded-lg border border-[#3E3834]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Welcome to our private circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#292524] border border-[#3E3834] rounded-lg px-3 py-2 text-xs text-white placeholder-[#78716C] focus:outline-none focus:border-[#C59B4B]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#DFC07D] text-[#1C1917] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#CFB06C] transition-colors"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© 2026 Aura &amp; Aether Parfums Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/admin" className="hover:text-[#DFC07D] transition-colors text-[11px]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
