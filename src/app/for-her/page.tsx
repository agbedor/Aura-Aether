import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getProducts, prisma } from "@/lib/db";

export const metadata = {
  title: "Fragrances for Her | Aura & Aether Parfums",
};

export default async function ForHerPage() {
  const [allProducts, settingsRows] = await Promise.all([
    getProducts({ giftSets: false }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value])) as Record<string, string>;
  const genderTerms = ["her", "women", "woman", "female"];
  const tagged = allProducts.filter((product) => {
    const label = `${product.category?.name || ""} ${product.category?.slug || ""}`.toLowerCase();
    return genderTerms.some((term) => label.includes(term));
  });
  const products = tagged.length ? tagged : allProducts;
  const title = settings.herTitle || "Fragrances for Her";
  const description = settings.herDescription || "Discover your next signature scent.";
  const image = settings.herImageUrl || "/images/hero-placeholder-2.svg";

  return (
    <div className="min-h-screen bg-[#FCFBF9] pb-16">
      <section className="relative isolate flex min-h-[340px] items-center justify-center overflow-hidden bg-[#29211F] px-5 py-20 text-center sm:min-h-[440px]">
        <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover transition-transform duration-[8000ms] hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/45" />
        <div className="relative z-10 max-w-3xl animate-fade-up text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E8BD9E]">Aura &amp; Aether · The collection</p>
          <h1 className="mt-4 font-serif-luxury text-4xl sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/85">{description}</p>
          <Link href="/shop" className="mt-7 inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#202020]">Explore all fragrances</Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B6658]">Find your signature</p><h2 className="mt-2 text-2xl font-semibold text-[#202020] sm:text-3xl">Explore the collection</h2></div>
          <p className="text-xs text-[#77716C]">{products.length} fragrances</p>
        </div>
        {products.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl border border-[#E8D9CE] bg-white p-10 text-center"><p className="text-sm text-[#77716C]">No fragrances are available yet.</p></div>}
      </section>
    </div>
  );
}
