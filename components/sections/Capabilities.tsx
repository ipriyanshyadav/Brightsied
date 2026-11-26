import { capabilities } from "@/lib/content";
import { tileGlow } from "@/components/ui/GlossyTile";
import { LiveTile } from "@/components/ui/LiveTile";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { GlowWord } from "@/components/ui/InlineIcons";

export function Capabilities() {
  return (
    <section aria-labelledby="cap-title" className="bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="lg:sticky lg:top-[32vh] lg:self-start">
          <p className="eyebrow">What I build</p>
          <BlurReveal id="cap-title" className="mt-4 text-split font-medium">
            Production systems for <GlowWord>retrieval</GlowWord>, agents, tool-calling and async work.
          </BlurReveal>
          <p className="mt-6 max-w-md text-ink/60">
            Mostly ordinary backend engineering, with a model somewhere in the loop and the
            guard rails that make it safe to run.
          </p>
        </div>

        <div className="panel-3d rounded-[28px] p-3 text-white sm:p-4">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <span className="panel-cell rounded-lg px-3 py-1.5 font-mono text-xs text-white/60">
              Library <span className="mx-1.5 text-white/25">|</span> Capabilities
            </span>
            <span className="font-mono text-xs text-white/35">4 items</span>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.id}>
                <div
                  className="panel-cell glow-card group flex h-full flex-col items-center rounded-2xl px-5 pb-6 pt-8 text-center"
                  style={{ ["--card-glow" as string]: tileGlow(c.tile) }}
                >
                  <LiveTile kind={c.tile} sizes="170px" className="w-24 sm:w-28" />
                  <h3 className="mt-8 font-mono text-sm text-white/90">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
