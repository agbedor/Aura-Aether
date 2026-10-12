import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import SiteChrome, { StorefrontFooter } from "@/components/SiteChrome";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura & Aether Parfums | Artisanal Luxury Fragrances",
  description:
    "Discover Aura & Aether Parfums. Handcrafted luxury perfumes, rare essences, curated gift sets, and signature fragrance collections.",
  keywords: [
    "Aura & Aether",
    "Luxury Perfume",
    "Artisanal Fragrance",
    "Eau de Parfum",
    "Oud",
    "Gift Sets",
    "Ghana Fragrances",
  ],
  openGraph: {
    title: "Aura & Aether Parfums | Artisanal Luxury Fragrances",
    description: "Elevate everyday moments to extraordinary with Aura & Aether.",
    siteName: "Aura & Aether Parfums",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans-clean bg-[#FCFBF9] text-[#1C1917] selection:bg-[#EADBC8] selection:text-[#1C1917]">
        <AuthProvider>
          <CartProvider>
            <SiteChrome />
            <main className="flex-1">{children}</main>
            <StorefrontFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
