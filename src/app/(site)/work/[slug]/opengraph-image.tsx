import { notFound } from "next/navigation";
import { getCaseStudy, getSettings } from "@/lib/content";
import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "A Brightseid case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const [site, item] = await Promise.all([getSettings(), getCaseStudy((await params).slug)]);
  if (!item) notFound();
  return renderOgCard({ wordmark: site.wordmark, eyebrow: "Case study", lines: [item.title], footer: `${item.tab} · ${site.name}` });
}
