"use client";

import { useEffect, useState } from "react";

const fallback = "Aura & Aether was created for the moments, moods, and memories that make you who you are. We believe the right fragrance is more than something you wear — it becomes part of your story.";

export default function AboutIntro() {
  const [intro, setIntro] = useState(fallback);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.settings?.aboutIntro === "string") setIntro(data.settings.aboutIntro);
      })
      .catch(() => undefined);
  }, []);

  return <p className="max-w-2xl mx-auto mt-7 text-sm sm:text-base leading-7 text-[#65534D]">{intro}</p>;
}
