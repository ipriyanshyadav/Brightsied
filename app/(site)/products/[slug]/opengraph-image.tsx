import { notFound } from "next/navigation";
import { getProduct, getSettings } from "@/lib/content";
import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "A Brightera product";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function ProductImage({ params }: { params: Promise<{ slug: string }> }) {
  const [site, product] = await Promise.all([getSettings(), getProduct((await params).slug)]);
  if (!product) notFound();
  return renderOgCard({ wordmark: site.wordmark, eyebrow: "Product", lines: [product.tagline], footer: `${product.name} · ${product.status}` });
}
