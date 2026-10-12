import Link from "next/link";
import AboutIntro from "@/components/AboutIntro";
import AboutHeading from "@/components/AboutHeading";
import { ArrowRight, Heart, Sparkles, Wind } from "lucide-react";

export const metadata = {
  title: "Our Story | Aura & Aether Parfums",
  description: "Get to know Aura & Aether Parfums — fragrance, feeling, and the signature you leave behind.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FFF0F6] text-[#17110F]">
      <section className="px-5 sm:px-8 py-20 sm:py-28 border-b border-[#F0DCE5]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#8B6658] mb-5">A little about us</p>
          <h1 className="font-serif-luxury text-5xl sm:text-7xl leading-tight"><AboutHeading /></h1>
          <AboutIntro />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-[#E7C2AD] min-h-[340px] sm:min-h-[440px] flex items-center justify-center p-10 text-center">
          <div className="max-w-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-6 text-[#7A4F3B]" />
            <p className="font-serif-luxury text-4xl sm:text-5xl leading-tight">Your scent.<br /><span className="italic">Your signature.</span></p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-[#7A4F3B]">Aura &amp; Aether Parfums</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6658] mb-4">Our philosophy</p>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl leading-tight">A scent can say what words cannot.</h2>
          <p className="mt-6 text-sm leading-7 text-[#65534D]">From soft and comforting to bold and unforgettable, every fragrance has its own character. Our aim is to make discovering that character feel thoughtful, joyful, and distinctly yours.</p>
          <p className="mt-4 text-sm leading-7 text-[#65534D]">Whether you are choosing an everyday favourite or a scent for a meaningful occasion, we want you to find something that feels like you — and stays with you.</p>
          <Link href="/shop" className="mt-8 inline-flex items-center gap-3 bg-[#17110F] text-white px-7 py-4 text-[11px] uppercase tracking-[0.18em] hover:bg-[#B77F60] transition-colors">Find your fragrance <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
      <section className="bg-white/70 border-y border-[#F0DCE5] py-14 sm:py-18">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-3 gap-10 text-center">
          <div><Sparkles className="w-6 h-6 mx-auto mb-4 text-[#B77F60]" /><h3 className="font-serif-luxury text-xl">Made for self-expression</h3><p className="mt-2 text-sm leading-6 text-[#65534D]">Choose the notes that match your mood and the impression you want to leave.</p></div>
          <div><Heart className="w-6 h-6 mx-auto mb-4 text-[#B77F60]" /><h3 className="font-serif-luxury text-xl">Chosen with care</h3><p className="mt-2 text-sm leading-6 text-[#65534D]">A considered collection for gifting, celebrating, and everyday rituals.</p></div>
          <div><Wind className="w-6 h-6 mx-auto mb-4 text-[#B77F60]" /><h3 className="font-serif-luxury text-xl">A lasting impression</h3><p className="mt-2 text-sm leading-6 text-[#65534D]">Because the best fragrances become part of the memories we make.</p></div>
        </div>
      </section>
      <section className="px-5 py-16 text-center">
        <p className="font-serif-luxury italic text-3xl">Find the fragrance that feels like you.</p>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] border-b border-[#B77F60] pb-2">Shop the collection <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
}
