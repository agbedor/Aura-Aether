"use client";

import React, { useState } from "react";
import Link from "next/link";
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

  const navLinks = [
    { name: "SHOP", href: "/shop" },
    { name: "GIFT SETS", href: "/gift-sets" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#EFE9E2] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Nav (Desktop) matching Reference 2 */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs font-semibold tracking-widest transition-colors py-1 relative ${
                      isActive
                        ? "text-[#1C1917] font-bold"
                        : "text-[#5C554F] hover:text-[#1C1917]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1C1917]" />
                    )}
                  </Link>
                );
              })}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-full hover:bg-[#FDE68A] transition-colors"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="p-2 text-[#1C1917] hover:text-[#78716C]"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Center Brand Logo (Reference 2: Serif logo PARFUM -> AURA & AETHER) */}
            <div className="flex-1 md:flex-initial text-center">
              <Link href="/" className="inline-block group py-2">
                <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#1C1917] block uppercase group-hover:opacity-85 transition-opacity">
                  AURA &amp; AETHER
                </span>
                <span className="font-sans-clean text-[9px] tracking-[0.4em] font-medium text-[#78716C] uppercase block -mt-1 group-hover:text-[#1C1917] transition-colors">
                  PARFUMS
                </span>
              </Link>
            </div>

            {/* Right Controls: Search, Account, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-[#3D3833] hover:text-black transition-colors rounded-full hover:bg-[#F3ECE5]"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </button>

              {/* Account Icon */}
              <Link
                href={user ? "/account" : "/login"}
                aria-label="Account"
                className="p-2 text-[#3D3833] hover:text-black transition-colors rounded-full hover:bg-[#F3ECE5] relative"
                title={user ? `Signed in as ${user.name}` : "Sign in / Register"}
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                {user && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white" />
                )}
              </Link>

              {/* Shopping Bag with Count (Reference 2) */}
              <button
                onClick={openCart}
                aria-label="Shopping bag"
                className="p-2 text-[#1C1917] hover:opacity-80 transition-opacity relative rounded-full hover:bg-[#F3ECE5] flex items-center"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1C1917] text-[#FAF8F5] text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#FCFBF9]">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-t border-[#EBE4DC] px-6 py-6 space-y-4 animate-fade-in shadow-lg">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-widest text-[#1C1917] py-2 border-b border-[#EFE8DF]"
                >
                  {link.name}
                </Link>
              ))}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-widest text-[#B45309] py-2 border-b border-[#EFE8DF]"
                >
                  ADMIN DASHBOARD
                </Link>
              )}

              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wide text-[#5C554F] py-2"
              >
                {user ? `Account (${user.name})` : "Login / Create Account"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Slide-over Shopping Bag Drawer */}
      <CartDrawer />
    </>
  );
}
