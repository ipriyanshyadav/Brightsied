import Link from "next/link";
import type { Service } from "@/lib/content/types";
import { tileGlow } from "@/components/ui/GlossyTile";
import { LiveTile } from "@/components/ui/LiveTile";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { GlowWord } from "@/components/ui/InlineIcons";

type Props = { services: Service[]; eyebrow?: string; withIntro?: boolean };

// Every service as a card in the dark library panel. The first (the lead offer) spans the row.
export function Capabilities({ services, eyebrow = "What we do", withIntro = true }: Props) {
  return (
    <section aria-labelledby="cap-title" className="bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-[32vh] lg:self-start">
          <p className="eyebrow">{eyebrow}</p>
          <BlurReveal id="cap-title" className="mt-4 text-split font-medium">
            Products, platforms and <GlowWord>AI</GlowWord>, engineered end to end.
          </BlurReveal>
          {withIntro && (
            <p className="mt-6 max-w-md text-ink/60">
              Build it with us, embed us in your team, or bring us in for a second opinion. Every
              engagement gets the same production-grade engineering.
            </p>
          )}
          <Link href="/services" className="btn-light mt-8 inline-block rounded-xl px-4 py-2 text-sm font-medium">
            All services and engagement models
          </Link>
        </div>

        <div className="panel-3d rounded-[28px] p-3 text-white sm:p-4">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <span className="panel-cell rounded-lg px-3 py-1.5 font-mono text-xs text-white/60">
              Brightseid <span className="mx-1.5 text-white/25">|</span> Services
            </span>
            <span className="font-mono text-xs text-white/35">{services.length} practices</span>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.map((c, i) => (
              <li key={c.slug} className={i === 0 ? "sm:col-span-2" : undefined}>
                <Link
                  href={`/services/${c.slug}`}
                  className={`panel-cell glow-card group flex h-full rounded-2xl px-5 pb-6 pt-8 transition-transform duration-500 hover:-translate-y-0.5 ${
                    i === 0 ? "flex-col items-center text-center sm:flex-row sm:gap-8 sm:pb-8 sm:text-left" : "flex-col items-center text-center"
                  }`}
                  style={{ ["--card-glow" as string]: tileGlow(c.tile) }}
                >
                  <LiveTile kind={c.tile} sizes="170px" className={i === 0 ? "w-24 shrink-0 sm:w-32" : "w-20 sm:w-24"} />
                  <span className={i === 0 ? "mt-8 block sm:mt-0" : "mt-8 block"}>
                    <span className="block font-mono text-sm text-white/90">{c.name}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-white/50">{c.summary}</span>
                    <span className="mt-4 inline-block text-xs text-[#9fb2ff] transition-colors group-hover:text-white">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
