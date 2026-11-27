"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { WorkItem } from "@/lib/content/types";
import { LiveTile } from "@/components/ui/LiveTile";
import { BlurReveal } from "@/components/ui/BlurReveal";

type Props = { items: WorkItem[]; eyebrow: string; title: string };

// One work item at a time, chosen from a sticky pill tab bar (arrow keys move between tabs).
export function WorkTabs({ items, eyebrow, title }: Props) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = items[active];
  const [a, b, c] = p.tiles;

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section aria-labelledby="work-tabs-title" className="scroll-mt-24 bg-ground px-4 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <p className="eyebrow">{eyebrow}</p>
          <BlurReveal id="work-tabs-title" className="mt-4 text-section font-medium">
            {title}
          </BlurReveal>
        </div>

        <div
          key={p.slug}
          role="tabpanel"
          id={`panel-${p.slug}`}
          aria-labelledby={`tab-${p.slug}`}
          className="panel-in mt-12 grid gap-4 lg:grid-cols-2"
        >
          <div className="card-soft relative isolate aspect-[5/4] overflow-hidden rounded-[28px]">
            <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-70" />
            <div aria-hidden="true" className="absolute bottom-[12%] left-1/2 h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-2xl" />
            <div aria-hidden="true" className="absolute inset-0">
              <LiveTile kind={a} rotate={-10} sizes="(min-width: 1024px) 260px, 45vw" className="float-y absolute left-[12%] top-[16%] w-[30%]" />
              <LiveTile kind={b} rotate={4} sizes="(min-width: 1024px) 290px, 50vw" className="float-y absolute left-[38%] top-[34%] w-[34%] [animation-delay:-3s]" />
              <LiveTile kind={c} rotate={12} sizes="(min-width: 1024px) 210px, 36vw" className="float-y absolute right-[10%] top-[12%] w-[24%] [animation-delay:-5s]" />
            </div>
          </div>
          <div className="card-soft flex items-center rounded-[28px] p-4 sm:p-8">
            <div className="panel-3d w-full rounded-[20px] p-6 text-white sm:p-8">
              <p className="font-mono text-xs text-white/45">{p.where}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-[28px] sm:leading-tight">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{p.body}</p>
              <ul className="mt-6 flex flex-col gap-2 text-sm text-white/80">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9fb2ff] shadow-[0_0_6px_1px_rgba(111,139,255,0.8)]" />
                    {pt}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
                {p.tags.map((t) => (
                  <li key={t} className="panel-cell rounded-md px-2 py-1 font-mono text-[11px] text-white/60">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2">
                {p.caseStudy && (
                  <Link href={`/work/${p.slug}`} className="btn-light inline-block rounded-xl px-4 py-2 text-sm font-medium">
                    Read the case study<span className="sr-only">: {p.tab}</span> <span aria-hidden="true">→</span>
                  </Link>
                )}
                <Link
                  href={p.href}
                  className={`inline-block rounded-xl px-4 py-2 text-sm font-medium ${
                    p.caseStudy ? "panel-cell text-white/90 transition-colors hover:text-white" : "btn-light"
                  }`}
                >
                  {p.kind === "lab" ? "Try it" : p.kind === "product" ? "See the product" : "Explore"}
                  <span className="sr-only">: {p.tab}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 z-20 mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label={eyebrow}
            onKeyDown={onKey}
            className="glass flex max-w-full gap-1 overflow-x-auto rounded-2xl p-1.5"
          >
            {items.map((proj, i) => (
              <button
                key={proj.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${proj.slug}`}
                aria-selected={active === i}
                aria-controls={`panel-${proj.slug}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={`shrink-0 rounded-xl px-4 py-2 text-[13px] transition-colors ${
                  active === i ? "btn-light text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {proj.tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`.panel-in{animation:panel-in .55s both var(--ease-out-soft)}@keyframes panel-in{from{opacity:0;transform:translateY(10px);filter:blur(4px)}}`}</style>
    </section>
  );
}
