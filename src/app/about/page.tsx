import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import AboutIntro from "@/components/AboutIntro";
import AboutHeading from "@/components/AboutHeading";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Story | Aura & Aether Parfums",
  description: "Get to know Aura & Aether Parfums — fragrance, feeling, and the signature you leave behind.",
};

export default async function AboutPage() {
  let aboutImageUrl = "/images/hero-placeholder-1.svg";
  try {
    const savedImage = await prisma.siteSetting.findUnique({ where: { key: "aboutImageUrl" } });
    if (savedImage?.value) aboutImageUrl = savedImage.value;
  } catch {
    // Use the local fallback if site settings are temporarily unavailable.
  }
  return (
    <div className="bg-[#FCFBF9] text-[#17110F]">
      <section className="px-5 sm:px-8 py-20 sm:py-28 border-b border-[#E8D9CE]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8B6658] mb-5">A little about us</p>
          <h1 className="font-serif-luxury text-5xl sm:text-7xl leading-tight"><AboutHeading /></h1>
          <AboutIntro />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative min-h-[340px] sm:min-h-[440px] overflow-hidden bg-[#E8D9CE]">
          <Image
            src={aboutImageUrl}
            alt="Aura & Aether Parfums brand story"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6658] mb-4">Our philosophy</p>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl leading-tight">A scent can say what words cannot.</h2>
          <p className="mt-6 text-sm leading-7 text-[#65534D]">From soft and comforting to bold and unforgettable, every fragrance has its own character. Our aim is to make discovering that character feel thoughtful, joyful, and distinctly yours.</p>
          <p className="mt-4 text-sm leading-7 text-[#65534D]">Whether you are choosing an everyday favourite or a scent for a meaningful occasion, we want you to find something that feels like you — and stays with you.</p>
          <Link href="/shop" className="mt-8 inline-flex items-center gap-3 bg-[#17110F] text-white px-7 py-4 text-[11px] uppercase tracking-[0.18em] hover:bg-[#B77F60] transition-colors">Find your fragrance <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
      <section className="px-5 py-16 text-center">
        <p className="font-serif-luxury italic text-3xl">Find the fragrance that feels like you.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] border-b border-[#B77F60] pb-2">Shop the collection <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
}
