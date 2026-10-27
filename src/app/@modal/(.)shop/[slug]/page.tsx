import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db";
import QuickViewDialog from "@/components/QuickViewDialog";

interface ProductModalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductModalPage({ params }: ProductModalPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const recommendations = (await getProducts({ giftSets: false }))
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return <QuickViewDialog product={product} recommendations={recommendations} />;
}
