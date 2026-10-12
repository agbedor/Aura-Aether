"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save, Settings2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Settings = {
  heroTitle: string;
  heroDescription: string;
  motto: string;
  announcement: string;
  aboutIntro: string;
};

const initial: Settings = {
  heroTitle: "Your scent. Your signature.",
  heroDescription: "Discover fragrances that feel like you. Find your signature scent, mark a moment, and leave a little magic wherever you go.",
  motto: "Your scent. Your signature.",
  announcement: "Find your signature scent with Aura & Aether Parfums.",
  aboutIntro: "Aura & Aether was created for the moments, moods, and memories that make you who you are.",
};

export default function StorefrontContentPage() {
  const { user, isLoading } = useAuth();
  const [settings, setSettings] = useState<Settings>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-settings").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...initial, ...data.settings });
      }
    }).catch(() => setMessage("Could not load saved settings.")).finally(() => setLoading(false));
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage("Your storefront settings have been saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || loading) return <div className="min-h-[60vh] grid place-items-center text-sm text-[#65534D]">Loading content settings…</div>;
  if (!user || user.role !== "ADMIN") return <div className="min-h-[60vh] grid place-items-center px-6 text-center"><div><h1 className="font-serif-luxury text-3xl">Admin access required</h1><p className="mt-3 text-sm text-[#65534D]">Sign in with an administrator account to edit storefront content.</p><Link href="/login" className="inline-block mt-5 underline">Go to sign in</Link></div></div>;

  const fields: { key: keyof Settings; label: string; help: string; multiline?: boolean }[] = [
    { key: "heroTitle", label: "Homepage hero heading", help: "Main headline shown at the top of the storefront." },
    { key: "heroDescription", label: "Homepage description", help: "Short paragraph beneath the headline.", multiline: true },
    { key: "motto", label: "Brand motto", help: "Your signature phrase." },
    { key: "announcement", label: "Announcement bar", help: "Short message displayed at the top of the store." },
    { key: "aboutIntro", label: "About page introduction", help: "Opening message on the About page.", multiline: true },
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F6] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#65534D] hover:text-black"><ArrowLeft className="w-4 h-4" /> Back to dashboard</Link>
        <div className="mt-7 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#17110F] text-[#E7B48F] grid place-items-center"><Settings2 className="w-5 h-5" /></div>
          <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6658]">Superadmin workspace</p><h1 className="font-serif-luxury text-4xl sm:text-5xl mt-1">Storefront content</h1><p className="mt-3 text-sm text-[#65534D] leading-6">Update key brand messages without editing the page code. Product and order management remain in the main dashboard.</p></div>
        </div>
        <form onSubmit={saveSettings} className="mt-10 bg-white/85 border border-[#F0DCE5] p-5 sm:p-8 space-y-7">
          {fields.map((field) => <label key={field.key} className="block"><span className="block text-xs font-semibold uppercase tracking-widest">{field.label}</span><span className="block mt-1.5 text-xs text-[#8B7A72]">{field.help}</span>{field.multiline ? <textarea rows={3} value={settings[field.key]} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className="mt-3 w-full border border-[#E8D8CF] bg-[#FFFAFC] px-4 py-3 text-sm outline-none focus:border-[#B77F60]" /> : <input value={settings[field.key]} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className="mt-3 w-full border border-[#E8D8CF] bg-[#FFFAFC] px-4 py-3 text-sm outline-none focus:border-[#B77F60]" />}</label>)}
          {message && <p role="status" className="text-sm text-[#65534D] flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-[#6C854B]" />{message}</p>}
          <div className="flex flex-col sm:flex-row gap-3"><button disabled={saving} className="inline-flex items-center justify-center gap-2 bg-[#17110F] text-white px-6 py-3 text-xs uppercase tracking-widest disabled:opacity-60"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save changes"}</button><Link href="/" className="inline-flex items-center justify-center border border-[#D9A17E] px-6 py-3 text-xs uppercase tracking-widest">View storefront</Link></div>
        </form>
        <p className="mt-4 text-xs leading-5 text-[#8B7A72]">Database note: after adding the SiteSetting model, run <code>npx prisma db push</code> and regenerate the Prisma client before using saved settings in a deployed environment.</p>
      </div>
    </div>
  );
}
