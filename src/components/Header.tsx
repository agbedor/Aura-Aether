"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, User as UserIcon, Menu, X, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [brandName, setBrandName] = useState("Aura & Aether Parfums");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.logoUrl) setLogoUrl(data.settings.logoUrl);
        if (data?.settings?.brandName) setBrandName(data.settings.brandName);
      })
      .catch(() => undefined);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "SHOP", href: "/shop" },
    { name: "GIFT SETS", href: "/gift-sets" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#E8D9CE] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <nav className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} className={`text-xs font-semibold tracking-widest transition-colors py-1 relative ${isActive ? "text-[#17110F] font-bold" : "text-[#6D625B] hover:text-[#B77F60]"}`}>
                    {link.name}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B77F60]" />}
                  </Link>
                );
              })}
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#8E5E45] bg-[#F5E8DF] px-2.5 py-1 rounded-full hover:bg-[#E8D2C2] transition-colors">
                  <Shield className="w-3 h-3" /><span>Admin</span>
                </Link>
              )}
            </nav>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" className="p-2 text-[#17110F] hover:text-[#B77F60]">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex-1 md:flex-initial text-center">
              <Link href="/" aria-label={brandName} className="inline-flex min-w-0 items-center justify-center py-2 group">
                {logoUrl ? (
                  <Image src={logoUrl} alt={brandName} width={250} height={72} priority className="h-12 sm:h-14 w-auto max-w-[190px] sm:max-w-[250px] object-contain" />
                ) : (
                  <span className="inline-block">
                    <span className="font-serif-luxury text-xl sm:text-2xl tracking-[0.12em] sm:tracking-[0.2em] font-semibold text-[#17110F] block uppercase group-hover:text-[#8E5E45] transition-colors">AURA &amp; AETHER</span>
                    <span className="font-sans-clean text-[8px] sm:text-[9px] tracking-[0.4em] font-medium text-[#B77F60] uppercase block">PARFUMS</span>
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => setIsSearchOpen(true)} aria-label="Search" className="p-2 text-[#3D3833] hover:text-[#B77F60] transition-colors rounded-full hover:bg-[#F5E8DF]"><Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" /></button>
              <Link href={user ? "/account" : "/login"} aria-label="Account" className="p-2 text-[#3D3833] hover:text-[#B77F60] transition-colors rounded-full hover:bg-[#F5E8DF] relative" title={user ? `Signed in as ${user.name}` : "Sign in / Register"}>
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white" />}
              </Link>
              <button onClick={openCart} aria-label="Shopping bag" className="p-2 text-[#17110F] hover:text-[#B77F60] transition-colors relative rounded-full hover:bg-[#F5E8DF] flex items-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-[#17110F] text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#FCFBF9]">{itemCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FCFBF9] border-t border-[#E8D9CE] px-6 py-6 space-y-4 animate-fade-in shadow-lg">
            <div className="space-y-3">
              {navLinks.map((link) => <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-semibold tracking-widest text-[#17110F] py-2 border-b border-[#E8D9CE]">{link.name}</Link>)}
              {user?.role === "ADMIN" && <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-semibold tracking-widest text-[#8E5E45] py-2 border-b border-[#E8D9CE]">ADMIN DASHBOARD</Link>}
              <Link href={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium tracking-wide text-[#6D625B] py-2">{user ? `Account (${user.name})` : "Login / Create Account"}</Link>
            </div>
          </div>
        )}
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
