"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const storyImages = [
  {
    mobile: "/images/about-story/story-01-mobile.jpeg",
    desktop: "/images/about-story/story-01-desktop.jpeg",
    alt: "A customer holding an Aura & Aether fragrance in a lush garden",
  },
  {
    mobile: "/images/about-story/story-02-mobile.jpeg",
    desktop: "/images/about-story/story-02-desktop.jpeg",
    alt: "A woman enjoying an Aura & Aether fragrance at home",
  },
  {
    mobile: "/images/about-story/story-03-mobile.jpeg",
    desktop: "/images/about-story/story-03-desktop.jpeg",
    alt: "A customer discovering an Aura & Aether fragrance by the coast",
  },
  {
    mobile: "/images/about-story/story-04-mobile.jpeg",
    desktop: "/images/about-story/story-04-desktop.jpeg",
    alt: "A woman with her Aura & Aether fragrance in a desert landscape",
  },
];

export default function StoryHero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % storyImages.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-white text-[#17110F] sm:block sm:h-[100svh] sm:min-h-[560px]">
      <div className="relative order-2 h-[58svh] min-h-[360px] bg-[#eee8e1] sm:absolute sm:inset-x-0 sm:bottom-0 sm:h-[60%] sm:min-h-0">
        {storyImages.map((image, index) => (
          <picture key={image.mobile} className={`absolute inset-0 transition-opacity duration-[1400ms] ${activeImage === index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <source media="(min-width: 640px)" srcSet={image.desktop} />
            <Image
              src={image.mobile}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </picture>
        ))}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 sm:bottom-6 sm:right-6" aria-label="Story images">
          {storyImages.map((image, index) => (
            <button
              key={image.mobile}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`Show story image ${index + 1}`}
              aria-current={activeImage === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === index ? "w-8 bg-white" : "w-2 bg-white/65 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 order-1 mx-auto flex max-w-[1600px] flex-col items-center px-4 pb-8 pt-32 text-center sm:absolute sm:inset-x-0 sm:top-0 sm:mx-auto sm:h-full sm:px-6 sm:pb-0 sm:pt-[12svh] lg:px-[4vw]">
        <p className="mx-auto inline-flex items-center rounded-full border border-black/20 px-4 py-2 text-[10px] font-medium tracking-[0.12em] sm:text-xs">
          Our story <span className="ml-2 text-base leading-none" aria-hidden="true">✳</span>
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-serif-luxury text-sm leading-snug sm:mt-5 sm:text-xl lg:text-2xl">
          Wear what can’t be seen, scent<br className="hidden sm:block" /> that lingers longer than presence.
        </p>
        <h1 className="font-vogue mt-4 text-[clamp(2.5rem,11.6vw,11.5rem)] leading-[0.95] tracking-[-0.075em] sm:mt-7 sm:whitespace-nowrap">
          AURA &amp; AETHER
        </h1>
      </div>
    </section>
  );
}
