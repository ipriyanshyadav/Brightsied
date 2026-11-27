"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import type { Product } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { StepScroller } from "./StepScroller";

// Clears the fixed nav when jumping to the walkthrough (matches SmoothScroll's anchor offset).
const NAV_OFFSET = -72;

// Every module of a product as cards, then one module at a time, step by step beside a live
// scene. Modules are picked from the cards or from a sticky pill tab bar (arrow keys move
// between tabs), and each has its own link: /products/<slug>#<module id>.
export function ProductModules({ product }: { product: Product }) {
  const { modules } = product;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const walkthrough = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Open the module named in the address (on load, and when a link changes the hash).
  useEffect(() => {
    const fromHash = () => {
      const i = modules.findIndex((m) => m.id === window.location.hash.slice(1));
      if (i !== -1) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [modules]);

  // Keep the chosen tab in view inside the scrolling tab bar.
  useEffect(() => {
    const tab = tabs.current[active];
    const bar = tab?.parentElement;
    if (!tab || !bar) return;
    const t = tab.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    bar.scrollTo({ left: bar.scrollLeft + t.left - b.left - (b.width - t.width) / 2, behavior: "smooth" });
  }, [active]);

  if (modules.length === 0) return null;
  const m = modules[active] ?? modules[0];


  const select = (i: number, jump: boolean) => {
    setActive(i);
    history.replaceState(null, "", `#${modules[i].id}`);
    const el = walkthrough.current;
    // Start the new module from its first step if the reader is part-way down the old one.
    if (el && (jump || el.getBoundingClientRect().top < 0)) {
      if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET });
      else el.scrollIntoView({ block: "start" });
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + modules.length) % modules.length;
    select(next, false);
    tabs.current[next]?.focus();
  };

  return (
    <section id={`${product.slug}-modules`} aria-labelledby={`${product.slug}-modules-title`} className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-3xl">
          <p className="eyebrow">What&apos;s inside</p>
          <BlurReveal id={`${product.slug}-modules-title`} className="mt-4 max-w-[22ch] text-section font-medium">
            Every module you need, working as one.
          </BlurReveal>
          <p className="mt-5 max-w-[56ch] text-ink/60">
            Use them together or start with the ones you need most. Pick a module to see how it works, step by step.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, i) => (
            <li key={mod.id}>
              <a
                href={`#${mod.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  select(i, true);
                }}
                className={`card-soft group flex h-full flex-col rounded-[24px] p-6 transition-shadow duration-300 ${active === i ? "ring-2 ring-brand/40" : ""}`}
              >
                <span className="font-mono text-xs text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-3 text-lg font-medium leading-snug tracking-tight">{mod.name}</span>
                <span className="mt-2 text-sm leading-relaxed text-ink/60">{mod.summary}</span>
                <span className="mt-auto pt-5 text-sm text-brand transition-colors group-hover:text-ink">
                  See how it works <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div ref={walkthrough} id={`${product.slug}-steps`} className="mt-24 scroll-mt-24">
          {modules.map((mod) => (
            <span key={mod.id} id={mod.id} className="block scroll-mt-24" />
          ))}
          <div key={m.id} role="tabpanel" id={`module-panel-${product.slug}`} aria-labelledby={`module-tab-${m.id}`} className="panel-in">
            <p className="eyebrow">
              Module {active + 1} of {modules.length}
            </p>
            <h3 className="mt-3 text-section font-medium">{m.name}</h3>
            <p className="mt-3 max-w-[56ch] text-ink/60">{m.summary}</p>
            <div className="mt-6">
              <StepScroller steps={m.steps} rules={product.rules} headingLevel="h4" />
            </div>
          </div>

          <div className="sticky bottom-6 z-20 mt-10 flex justify-center">
            <div role="tablist" aria-label={`${product.shortName} modules`} onKeyDown={onKey} className="glass flex max-w-full gap-1 overflow-x-auto rounded-2xl p-1.5">
              {modules.map((mod, i) => (
                <button
                  key={mod.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`module-tab-${mod.id}`}
                  aria-selected={active === i}
                  aria-controls={`module-panel-${product.slug}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => select(i, false)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-[13px] transition-colors ${active === i ? "btn-light text-ink" : "text-ink/60 hover:text-ink"}`}
                >
                  {mod.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`.panel-in{animation:panel-in .55s both var(--ease-out-soft)}@keyframes panel-in{from{opacity:0;transform:translateY(10px);filter:blur(4px)}}`}</style>
    </section>
  );
}
