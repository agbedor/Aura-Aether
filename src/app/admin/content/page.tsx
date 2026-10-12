"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save, Settings2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Settings = Record<string, string>;

const initial: Settings = {
  brandName: "Aura & Aether Parfums",
  logoUrl: "",
  primaryColor: "#17110F",
  accentColor: "#B77F60",
  backgroundColor: "#FCFBF9",
  announcement: "Find your signature scent with Aura & Aether Parfums.",
  footerDescription: "Discover fragrances that feel like you. Find your signature scent, mark a moment, and leave a little magic wherever you go.",
  heroTitle: "Aura & Aether",
  heroDescription: "Fragrance that says something about you. Find the scent that feels like yours.",
  motto: "Your scent. Your signature.",
  heroImageUrl: "/images/hero-editorial.svg",
  heroCtaLabel: "Explore the collection",
  homeFeaturedEyebrow: "OUR COLLECTION",
  homeFeaturedTitle: "Featured fragrances.",
  homeGiftTitle: "Curated Gift Sets.",
  homeGiftDescription: "Thoughtfully chosen fragrances for meaningful moments and memorable gifts.",
  homePromoTitle: "Find your next signature",
  homePromoDescription: "Explore fragrances for every mood, moment, and version of you.",
  aboutTitle: "Our story",
  aboutIntro: "Aura & Aether was created for the moments, moods, and memories that make you who you are.",
  shopEyebrow: "THE COLLECTION",
  shopTitle: "Find your fragrance.",
  shopDescription: "Explore scents for every mood, moment, and personal signature.",
  giftSetsEyebrow: "GIFT WITH MEANING",
  giftSetsTitle: "Gift Sets",
  giftSetsDescription: "Discover thoughtful fragrance gifts made for celebrations, everyday moments, and people you love.",
  contactEyebrow: "WE ARE HERE TO HELP",
  contactTitle: "Contact Aura & Aether",
  contactDescription: "Questions about a fragrance or an order? We would love to hear from you.",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
};

const groups: { title: string; description: string; fields: { key: string; label: string; help?: string; multiline?: boolean; type?: string }[] }[] = [
  { title: "Brand identity & appearance", description: "These settings shape the site's shared brand presentation.", fields: [
    { key: "brandName", label: "Brand name" },
    { key: "logoUrl", label: "Logo image URL or public path", help: "Use a path such as /images/your-logo.png after the logo file has been added to the website." },
    { key: "primaryColor", label: "Primary colour (hex)" },
    { key: "accentColor", label: "Signature copper / accent colour (hex)" },
    { key: "backgroundColor", label: "Page background colour (hex)" },
    { key: "announcement", label: "Announcement bar message" },
    { key: "footerDescription", label: "Footer brand description", multiline: true },
  ]},
  { title: "Homepage hero", description: "The full-screen background image and oversized title overlay.", fields: [
    { key: "heroTitle", label: "Large hero title" },
    { key: "heroDescription", label: "Hero description", multiline: true },
    { key: "motto", label: "Brand motto" },
    { key: "heroImageUrl", label: "Hero background image URL or public path", help: "For example /images/hero.jpg. Add the image to public/images first." },
    { key: "heroCtaLabel", label: "Hero button label" },
  ]},
  { title: "Homepage sections", description: "Headings and supporting text for the main storefront sections.", fields: [
    { key: "homeFeaturedEyebrow", label: "Featured section small heading" },
    { key: "homeFeaturedTitle", label: "Featured section title" },
    { key: "homeGiftTitle", label: "Gift sets section title" },
    { key: "homeGiftDescription", label: "Gift sets section description", multiline: true },
    { key: "homePromoTitle", label: "Promotion title" },
    { key: "homePromoDescription", label: "Promotion description", multiline: true },
  ]},
  { title: "About page", description: "Brand story content.", fields: [
    { key: "aboutTitle", label: "About page title" },
    { key: "aboutIntro", label: "About page introduction", multiline: true },
  ]},
  { title: "Shop page", description: "The introductory content above the product catalogue.", fields: [
    { key: "shopEyebrow", label: "Small heading" },
    { key: "shopTitle", label: "Shop page title" },
    { key: "shopDescription", label: "Shop page description", multiline: true },
  ]},
  { title: "Gift Sets page", description: "The introductory content above gift products.", fields: [
    { key: "giftSetsEyebrow", label: "Small heading" },
    { key: "giftSetsTitle", label: "Gift Sets page title" },
    { key: "giftSetsDescription", label: "Gift Sets page description", multiline: true },
  ]},
  { title: "Contact page", description: "Contact page copy and customer-facing contact details.", fields: [
    { key: "contactEyebrow", label: "Small heading" },
    { key: "contactTitle", label: "Contact page title" },
    { key: "contactDescription", label: "Contact page description", multiline: true },
    { key: "contactEmail", label: "Public contact email", type: "email" },
    { key: "contactPhone", label: "Public contact phone" },
    { key: "contactAddress", label: "Public address / delivery location", multiline: true },
  ]},
];

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
      } else {
        setMessage("Could not load saved settings.");
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
      setMessage("Saved. Refresh the storefront to see the changes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || loading) return <div className="min-h-[60vh] grid place-items-center text-sm text-[#65534D]">Loading website settings…</div>;
  if (!user || user.role !== "ADMIN") return <div className="min-h-[60vh] grid place-items-center px-6 text-center"><div><h1 className="font-serif-luxury text-3xl">Admin access required</h1><p className="mt-3 text-sm text-[#65534D]">Sign in with an administrator account to edit website content.</p><Link href="/login" className="inline-block mt-5 underline">Go to sign in</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#65534D] hover:text-black"><ArrowLeft className="w-4 h-4" /> Back to dashboard</Link>
        <div className="mt-7 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#17110F] text-[#E8BD9E] grid place-items-center"><Settings2 className="w-5 h-5" /></div>
          <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6658]">Administrator workspace</p><h1 className="font-serif-luxury text-4xl sm:text-5xl mt-1">Website content</h1><p className="mt-3 text-sm text-[#65534D] leading-6">Manage brand settings and editable content across the homepage, About, Shop, Gift Sets, Contact, announcement bar, and footer. Products and orders remain in the main admin dashboard.</p></div>
        </div>

        <form onSubmit={saveSettings} className="mt-10 space-y-6">
          {groups.map((group) => (
            <section key={group.title} className="bg-white border border-[#E8D9CE] p-5 sm:p-8">
              <h2 className="font-serif-luxury text-2xl">{group.title}</h2>
              <p className="mt-2 mb-6 text-sm leading-6 text-[#7B6B62]">{group.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.fields.map((field) => (
                  <label key={field.key} className={`block ${field.multiline ? "md:col-span-2" : ""}`}>
                    <span className="block text-xs font-semibold uppercase tracking-widest">{field.label}</span>
                    {field.help && <span className="block mt-1.5 text-xs leading-5 text-[#8B7A72]">{field.help}</span>}
                    {field.multiline ? (
                      <textarea rows={3} value={settings[field.key] ?? ""} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className="mt-3 w-full border border-[#E8D8CF] bg-[#FFFCFA] px-4 py-3 text-sm outline-none focus:border-[#B77F60]" />
                    ) : (
                      <input type={field.type || "text"} value={settings[field.key] ?? ""} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className="mt-3 w-full border border-[#E8D8CF] bg-[#FFFCFA] px-4 py-3 text-sm outline-none focus:border-[#B77F60]" />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
          {message && <p role="status" className="text-sm text-[#65534D] flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-[#6C854B]" />{message}</p>}
          <div className="flex flex-col sm:flex-row gap-3"><button disabled={saving} className="inline-flex items-center justify-center gap-2 bg-[#17110F] text-white px-6 py-3 text-xs uppercase tracking-widest disabled:opacity-60"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save website changes"}</button><Link href="/" className="inline-flex items-center justify-center border border-[#B77F60] px-6 py-3 text-xs uppercase tracking-widest">View storefront</Link></div>
        </form>
        <p className="mt-5 text-xs leading-5 text-[#8B7A72]">Image fields accept public paths or URLs; the image file itself must already be hosted or added to the site's public/images folder. Existing product and order management is unchanged.</p>
      </div>
    </div>
  );
}
