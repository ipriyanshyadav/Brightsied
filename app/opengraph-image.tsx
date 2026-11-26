import { getHome, getSettings } from "@/lib/content";
import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Brightera: software that ships, AI that holds up";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [site, { hero }] = await Promise.all([getSettings(), getHome()]);
  return renderOgCard({
    wordmark: site.wordmark,
    lines: hero.title,
    footer: `Product engineering · Forward-deployed engineers · AI systems · ${site.location}`,
  });
}
