"use client";

import { useEffect, useState } from "react";

export default function AboutHeading() {
  const [title, setTitle] = useState("Fragrance is personal. Make it yours.");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.settings?.aboutTitle === "string") setTitle(data.settings.aboutTitle);
      })
      .catch(() => undefined);
  }, []);

  return <>{title}</>;
}
