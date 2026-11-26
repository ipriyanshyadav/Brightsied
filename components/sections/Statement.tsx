"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { GlossyTile, type TileKind } from "@/components/ui/GlossyTile";

const steps: { kind: TileKind; label: string }[] = [
  { kind: "docs", label: "ingest" },
  { kind: "vectors", label: "embed" },
  { kind: "agents", label: "route" },
  { kind: "queue", label: "enqueue" },
  { kind: "audit", label: "audit" },
];

function Slot({ i }: { i: number }) {
  return (
    <span className="tile-slot" data-i={i}>
      <GlossyTile kind={steps[i].kind} sizes="110px" className="h-full w-full" />
    </span>
  );
}

const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

// Desktop: the section pins, the sentence lights up word by word, then scrolls away while
// its inline tiles drop into the pipeline card. Mobile and reduced motion get a static layout.
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        const el = stage.current!;
        let ctx: gsap.Context | null = null;

        const build = () => {
          ctx?.revert();
          el.dataset.anim = "on";
          ctx = gsap.context(() => {
            const split = SplitText.create(".stmt", { type: "words", aria: "auto", wordsClass: "split-word" });
            const box = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const placeholders = gsap.utils.toArray<HTMLElement>(".tile-slot", el);
            const targets = gsap.utils.toArray<HTMLElement>(".card-slot", el);
            const fliers = gsap.utils.toArray<HTMLElement>(".tile-fly", el);

            fliers.forEach((f, i) => {
              const a = placeholders[i].getBoundingClientRect();
              gsap.set(f, {
                left: a.left - box.left,
                top: a.top - box.top,
                width: a.width,
                height: a.height,
                rotation: (i % 2 ? 1 : -1) * 4,
              });
            });
            const ends = targets.map((t) => {
              const b = t.getBoundingClientRect();
              return { left: b.left - box.left, top: b.top - box.top, width: b.width, height: b.height };
            });

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: el, start: "top top", end: "+=190%", pin: true, scrub: 0.8, anticipatePin: 1 },
            });
            tl.from(split.words, { opacity: 0.14, stagger: 0.03, duration: 0.1 }, 0)
              .from(".pipeline-card", { y: vh * 0.4, duration: 0.6, ease: "power2.inOut" }, 0.38)
              .to(".stmt", { y: -vh * 0.6, opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.4);
            fliers.forEach((f, i) => {
              tl.to(f, { ...ends[i], rotation: 0, duration: 0.5, ease: "power3.inOut" }, 0.47 + i * 0.035);
            });
            tl.from(".card-label", { opacity: 0, y: 6, stagger: 0.03, duration: 0.15 }, 0.95);
            tl.to({}, { duration: 0.2 });
          }, el);
        };

        build();
        let timer = 0;
        const onResize = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(build, 200);
        };
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("resize", onResize);
          window.clearTimeout(timer);
          ctx?.revert();
          delete el.dataset.anim;
        };
      });

      mm.add(MOBILE, () => {
        const split = SplitText.create(".stmt", { type: "words", aria: "auto", wordsClass: "split-word" });
        gsap.from(split.words, {
          opacity: 0.14,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".stmt", start: "top 80%", end: "bottom 45%", scrub: true },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="What I build" className="bg-ground">
      <div ref={stage} className="stage relative overflow-hidden px-4 py-24 data-[anim=on]:h-[100svh] data-[anim=on]:py-0">
        <p className="stmt mx-auto max-w-[23ch] text-center text-statement font-medium in-data-[anim=on]:pt-[24vh]">
          I build backends that read <Slot i={0} /> documents, search{" "}
          <Slot i={1} /> vectors, coordinate <Slot i={2} /> agents and work through{" "}
          <Slot i={3} /> queues, with every decision on <Slot i={4} /> the record.
        </p>

        <div className="pipeline-card panel-3d mx-auto mt-16 w-full max-w-[1120px] rounded-[28px] p-4 text-white sm:p-6 in-data-[anim=on]:absolute in-data-[anim=on]:inset-x-0 in-data-[anim=on]:top-[calc(54%-150px)] in-data-[anim=on]:mt-0 in-data-[anim=on]:w-[min(1120px,92vw)]">
          <div className="flex items-center gap-3 text-[13px]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(180deg,#5b7bff,#2f4ae0)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_0_1px_#1a2b94,0_6px_16px_-4px_rgba(59,91,255,0.7)]" aria-hidden="true">
              <svg width="10" height="12" viewBox="0 0 10 12"><rect width="3" height="12" rx="1" fill="#fff" /><rect x="7" width="3" height="12" rx="1" fill="#fff" /></svg>
            </span>
            <span className="font-mono text-white/90">pipeline.run</span>
            <span className="font-mono text-white/40">00:01.25 / 00:05</span>
            <span className="panel-cell ml-auto hidden rounded-lg px-2.5 py-1 font-mono text-white/60 sm:inline">5 stages</span>
          </div>
          <div className="relative mt-4 hidden h-6 items-center justify-between font-mono text-[11px] text-white/40 sm:flex" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i}>{i}s</span>
            ))}
            <span className="absolute left-[12%] right-[52%] top-1/2 h-6 -translate-y-1/2 rounded-md border border-[#6f8bff]/50 bg-[linear-gradient(90deg,rgba(75,107,255,0.08),rgba(75,107,255,0.28))] shadow-[0_0_18px_-2px_rgba(75,107,255,0.6)]" />
          </div>
          <ol className="mt-5 grid grid-cols-5 gap-3 sm:gap-6">
            {steps.map((s, i) => (
              <li key={s.label} className="flex flex-col items-center gap-2">
                <span className="card-slot block aspect-square w-full" data-i={i}>
                  <GlossyTile kind={s.kind} sizes="(min-width: 768px) 280px, 110px" className="h-full w-full" />
                </span>
                <span className="card-label font-mono text-[11px] text-white/55 sm:text-xs">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {steps.map((s) => (
            <div key={s.label} className="tile-fly absolute">
              <GlossyTile kind={s.kind} sizes="(min-width: 768px) 280px, 110px" className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
