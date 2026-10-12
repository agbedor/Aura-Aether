"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState("Find your signature scent with Aura & Aether Parfums.");

  useEffect(() => {
    fetch("/api/site-settings").then((res) => res.ok ? res.json() : null).then((data) => {
      if (data?.settings?.announcement) setAnnouncement(data.settings.announcement);
    }).catch(() => undefined);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#17110F] text-[#FCFBF9] text-xs font-medium tracking-wider transition-all duration-300 relative border-b border-[#3B2A22]"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between">
        {/* Left subtle promo tag */}
        <div className="hidden md:flex items-center gap-1.5 text-[#D7B49A]">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B58F]" />
          <span className="uppercase tracking-widest text-[10px]">Artisanal Coffrets</span>
        </div>

        {/* Center message matching Reference 2 */}
        <div className="flex-1 text-center font-normal">
          <Link
            href="/shop"
            className="hover:underline hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
          >
            <span>{announcement}</span>
          </Link>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          className="text-[#D7B49A] hover:text-white transition-colors p-1 -mr-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
