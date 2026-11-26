import { notFound } from "next/navigation";
import { getService, getSettings } from "@/lib/content";
import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "A Brightera service";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function ServiceImage({ params }: { params: Promise<{ slug: string }> }) {
  const [site, service] = await Promise.all([getSettings(), getService((await params).slug)]);
  if (!service) notFound();
  return renderOgCard({ wordmark: site.wordmark, eyebrow: "Services", lines: [service.headline], footer: `${service.name} · ${site.name}` });
}
