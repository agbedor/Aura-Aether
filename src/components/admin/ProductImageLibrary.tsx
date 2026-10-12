"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload, CheckCircle2 } from "lucide-react";

type CatalogImage = { id: string; name: string; image: string; isFeatured?: boolean; isGiftSet?: boolean; isSale?: boolean };

export default function ProductImageLibrary() {
  const [products, setProducts] = useState<CatalogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/products").then((res) => res.ok ? res.json() : Promise.reject()).then((data) => setProducts(data.products || [])).catch(() => setMessage("Could not load product images.")).finally(() => setLoading(false));
  }, []);

  async function replaceImage(product: CatalogImage, file?: File) {
    if (!file) return;
    setUploading(product.id);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/admin/media", { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
      const updateRes = await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: product.id, image: uploadData.url }) });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || "Could not save product image");
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, image: uploadData.url } : item));
      setMessage("Image updated for " + product.name + ".");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not replace image.");
    } finally {
      setUploading("");
    }
  }

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F1F3F6] text-[#6D7480]"><ImageIcon size={17} /></span>
        <div><h2 className="text-base font-bold text-[#20242B]">Product image library</h2><p className="mt-1 text-xs leading-5 text-[#858B96]">Every product image is listed here, including featured fragrances and gift sets. Replace images without opening each product record.</p></div>
      </div>
      {message && <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-[#F7F8FA] p-3 text-xs text-[#555D69]"><CheckCircle2 size={14} />{message}</p>}
      {loading ? <p className="mt-5 text-sm text-[#858B96]">Loading product images…</p> : products.length === 0 ? <p className="mt-5 text-sm text-[#858B96]">No products found yet.</p> : <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => <article key={product.id} className="overflow-hidden rounded-xl border border-[#E8EAEE] transition-all duration-200 hover:-translate-y-1 hover:border-[#D5C0B2] hover:shadow-md">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F1EE]"><img src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-105" /></div>
          <div className="p-4">
            <p className="text-sm font-bold text-[#303640]">{product.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{product.isFeatured && <span className="rounded-md bg-[#F0F2F6] px-2 py-1 text-[10px] font-semibold text-[#606775]">Featured</span>}{product.isGiftSet && <span className="rounded-md bg-[#F8EEE7] px-2 py-1 text-[10px] font-semibold text-[#8B5D45]">Gift set</span>}{product.isSale && <span className="rounded-md bg-[#EAF6EF] px-2 py-1 text-[10px] font-semibold text-[#35754D]">On sale</span>}</div>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#E0E3E8] px-3 py-2.5 text-xs font-bold text-[#4F5662] transition-colors hover:border-[#B77F60] hover:text-[#8B5D45]"><Upload size={14} />{uploading === product.id ? "Uploading…" : "Replace product image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={!!uploading} className="hidden" onChange={(e) => { void replaceImage(product, e.target.files?.[0]); e.currentTarget.value = ""; }} /></label>
          </div>
        </article>)}
      </div>}
    </section>
  );
}
