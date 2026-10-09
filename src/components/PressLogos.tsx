import React from "react";

export default function PressLogos() {
  const logos = [
    { name: "flow", style: "font-serif italic font-light tracking-wide text-2xl lowercase" },
    { name: "NINO", style: "font-sans font-bold tracking-[0.25em] text-lg uppercase" },
    { name: "InTrend", style: "font-serif font-medium tracking-tight text-xl italic" },
    { name: "JUNE", style: "font-sans font-black tracking-widest text-lg uppercase" },
    { name: "ZINE", style: "font-mono font-medium tracking-[0.2em] text-lg uppercase" },
    { name: "MAX", style: "font-sans font-extrabold tracking-[0.3em] text-xl uppercase" },
  ];

  return (
    <section className="bg-white border-b border-[#EFE9E2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A89F95] mb-6">
          AS SEEN IN
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20 opacity-70 hover:opacity-100 transition-opacity">
          {logos.map((logo) => (
            <span
              key={logo.name}
              className={`text-[#292524] select-none ${logo.style}`}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
