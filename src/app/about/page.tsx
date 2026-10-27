import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import StoryHero from "@/components/about/StoryHero";
import Founder from "@/components/about/Founder";
import Testimonials from "@/components/about/Testimonials";
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
      <StoryHero />
      <Founder />
      <Testimonials />
    </div>
  );
}
