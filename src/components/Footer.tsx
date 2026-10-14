"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [footerDescription, setFooterDescription] = useState("Discover fragrances that feel like you. Find your signature scent, mark a moment, and leave a little magic wherever you go.");
  const [brandName, setBrandName] = useState("Aura & Aether Parfums");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.logoUrl) setLogoUrl(data.settings.logoUrl);
        if (data?.settings?.footerDescription) setFooterDescription(data.settings.footerDescription);
        if (data?.settings?.brandName) setBrandName(data.settings.brandName);
      })
      .catch(() => undefined);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer className="bg-[#17110F] text-[#FCFBF9] pt-16 pb-12 border-t border-[#3B2A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#3B2A22]">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" aria-label={brandName} className="inline-flex min-h-14 items-center">
              {logoUrl ? <Image src={logoUrl} alt={brandName} width={250} height={72} className="h-12 w-auto max-w-[240px] object-contain" /> : <span className="inline-block"><span className="font-serif-luxury text-2xl font-semibold tracking-[0.18em] text-white block uppercase">AURA &amp; AETHER</span><span className="font-sans-clean text-[9px] tracking-[0.4em] font-medium text-[#D7A17E] uppercase block">PARFUMS</span></span>}
            </Link>
            <p className="text-xs text-[#C7B9B0] leading-relaxed max-w-sm font-light">{footerDescription}</p>
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2A211D] border border-[#4A352B] text-[11px] text-[#F0D9C9]"><ShieldCheck className="w-4 h-4 text-[#D7A17E]" /><span>Mobile Money via <strong>Moolre</strong></span></div>
              <span className="text-[11px] text-[#C7B9B0]">Ghana Delivery</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">Fragrances</h4>
            <ul className="space-y-2.5 text-xs text-[#C7B9B0]">
              <li><Link href="/shop?category=floral" className="hover:text-[#E8BD9E] transition-colors">Floral Symphonies</Link></li>
              <li><Link href="/shop?category=fresh" className="hover:text-[#E8BD9E] transition-colors">Fresh &amp; Citrus Accords</Link></li>
              <li><Link href="/shop?category=woody" className="hover:text-[#E8BD9E] transition-colors">Woody &amp; Earthy Resins</Link></li>
              <li><Link href="/shop?category=amber-spice" className="hover:text-[#E8BD9E] transition-colors">Amber &amp; Spiced Accords</Link></li>
              <li><Link href="/gift-sets" className="hover:text-[#E8BD9E] transition-colors">Curated Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#C7B9B0]">
              <li><Link href="/account" className="hover:text-[#E8BD9E] transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-[#E8BD9E] transition-colors">Order Tracking</Link></li>
              <li><Link href="/contact" className="hover:text-[#E8BD9E] transition-colors">Contact Boutique</Link></li>
              <li><Link href="/contact#faq" className="hover:text-[#E8BD9E] transition-colors">Fragrance Consultation FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">The Scent Circle</h4>
            <p className="text-xs text-[#C7B9B0] mb-3 font-light leading-relaxed">Subscribe for private release invitations and new fragrance updates.</p>
            {subscribed ? <div className="flex items-center gap-2 text-xs text-[#E8BD9E] bg-[#2A211D] p-2.5 rounded-lg border border-[#4A352B]"><CheckCircle2 className="w-4 h-4" /><span>Welcome to our private circle.</span></div> : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#2A211D] border border-[#4A352B] rounded-lg px-3 py-2 text-xs text-white placeholder-[#A89487] focus:outline-none focus:border-[#D7A17E]" />
                <button type="submit" className="w-full py-2 bg-[#B77F60] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#996447] transition-colors">Join Circle</button>
              </form>
            )}
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89487] gap-4">
          <p>© 2026 {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-[#E8BD9E] transition-colors">Terms &amp; Conditions</Link>
            <Link href="/contact" className="hover:text-[#E8BD9E] transition-colors">Privacy Policy</Link>
            <Link href="/admin" className="hover:text-[#E8BD9E] transition-colors text-[11px]">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
