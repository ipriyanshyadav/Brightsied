"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const tones: Record<Product["window"]["rows"][number]["tone"], string> = {
  neutral: "bg-[#2a2a2a] text-white/70",
  amber: "bg-[#3a2e10] text-[#ffd38a]",
  mint: "bg-[#103a2a] text-[#7ff0c0]",
  blue: "bg-[#1d2a55] text-[#9fb2ff]",
};

// The illustrative app window shows sample rows, labelled as such under it.
function AppWindow({ w }: { w: Product["window"] }) {
  return (
    <div className="app-window panel-3d overflow-hidden rounded-[22px] text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.65)]" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-panel-line px-4 py-3">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${c} 55%)`, boxShadow: `inset 0 -1px 1px #0005` }} />
        ))}
        <span className="ml-3 font-mono text-[11px] text-white/40">{w.path}</span>
      </div>
      <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1">
        <ul className="border-r border-panel-line p-3 text-[13px] max-md:hidden">
          {w.sidebar.map((s) => (
            <li key={s} className={`rounded-lg px-3 py-2 ${s === w.activeItem ? "panel-cell text-white" : "text-white/45"}`}>
              {s}
            </li>
          ))}
        </ul>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium tracking-tight">{w.title}</p>
            <span className="btn-light rounded-lg px-3 py-1.5 text-xs font-medium">{w.action}</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-panel-line">
            <div className="panel-cell grid grid-cols-[1fr_2fr_0.6fr_1fr] gap-2 px-4 py-2.5 font-mono text-[11px] text-white/40">
              {w.columns.map((c) => <span key={c}>{c}</span>)}
            </div>
            {w.rows.map((r) => (
              <div key={r.id} className="grid grid-cols-[1fr_2fr_0.6fr_1fr] items-center gap-2 border-t border-panel-line px-4 py-3 text-[13px]">
                <span className="font-mono text-white/60">{r.id}</span>
                <span className="truncate">{r.item}</span>
                <span className="font-mono text-white/60">{r.qty}</span>
                <span className={`w-fit rounded-md px-2 py-0.5 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${tones[r.tone]}`}>{r.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Diagram({ product, step }: { product: Product; step: number }) {
  const s = product.steps[step];
  const lit = new Set<string>(s.lit);
  return (
    <div className="panel-3d rounded-[20px] p-4 text-white sm:p-5">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-white/40">
        <span>event</span>
        <span key={s.event} className="step-swap panel-cell rounded-md px-2 py-1 text-white/90">{s.event}</span>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {product.components.map((svc) => {
          const on = lit.has(svc.id);
          return (
            <li
              key={svc.id}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-[13px] transition-all duration-500 ${
                on ? "lit" : "panel-cell text-white/35"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${on ? "bg-[#c4d0ff] shadow-[0_0_8px_2px_rgba(111,139,255,0.9)]" : "bg-white/20"}`} />
              {svc.label}
              {on && <span className="sr-only"> (used in this step)</span>}
            </li>
          );
        })}
      </ul>
      <div
        className={`mt-2 flex items-center gap-2.5 rounded-xl px-3 py-3 text-[13px] transition-all duration-500 ${
          lit.has("audit") ? "lit-amber" : "panel-cell text-white/35"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${lit.has("audit") ? "bg-[#ffc24a] shadow-[0_0_8px_2px_rgba(245,158,11,0.9)]" : "bg-white/20"}`} />
        {product.auditLabel}
      </div>
      <style>{`.step-swap{animation:step-swap .45s both var(--ease-out-soft)}@keyframes step-swap{from{opacity:0;transform:translateY(6px)}}`}</style>
    </div>
  );
}

type Props = {
  product: Product;
  /** "spotlight" introduces the product (home page); "walkthrough" sits under a product hero. */
  variant?: "spotlight" | "walkthrough";
};

// The product's app window stands up in 3D on scroll, then a step-by-step walkthrough
// lights up the parts of the system each step uses.
export function ProductWalkthrough({ product, variant = "spotlight" }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  // The app window starts tipped back in 3D and stands up as it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".app-window",
          { rotateX: 24, y: 70, scale: 0.9, transformOrigin: "50% 100%" },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: stage.current, start: "top 95%", end: "top 35%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: stage },
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id={`${product.slug}-walkthrough`}
      aria-labelledby={`${product.slug}-title`}
      className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{variant === "spotlight" ? "Our products" : "How it works"}</p>
          <BlurReveal id={`${product.slug}-title`} className={`mt-4 font-medium ${variant === "spotlight" ? "text-hero" : "text-section"}`}>
            {variant === "spotlight" ? `${product.shortName}, by Brightera.` : `Inside ${product.shortName}, step by step.`}
          </BlurReveal>
          {variant === "spotlight" && <p className="mx-auto mt-6 max-w-[54ch] text-ink/65">{product.summary}</p>}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`#${product.slug}-steps`} className="btn-3d inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
              Walk through it
            </a>
            {variant === "spotlight" && (
              <Link href={`/products/${product.slug}`} className="btn-light inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
                Explore {product.shortName}
              </Link>
            )}
          </div>
        </div>

        <div ref={stage} className="relative isolate mt-16 [perspective:1600px]">
          <div aria-hidden="true" className="aurora left-[10%] top-[20%] -z-10 h-[60%] w-[40%] bg-[#7f9bff] opacity-35" />
          <div aria-hidden="true" className="aurora right-[8%] top-[30%] -z-10 h-[50%] w-[35%] bg-[#ffb07a] opacity-30" />
          <AppWindow w={product.window} />
          <p className="mt-3 text-center text-xs text-muted">Illustrative screen with sample data.</p>
        </div>

        <div id={`${product.slug}-steps`} className="mt-28 grid scroll-mt-24 gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
          <ol>
            {product.steps.map((step, i) => (
              <li
                key={step.title}
                data-step={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                aria-current={active === i ? "step" : undefined}
                className="flex flex-col justify-center py-10 lg:min-h-[58vh]"
              >
                <p className="eyebrow">Step {i + 1} of {product.steps.length}</p>
                <h3 className={`mt-3 text-split font-medium transition-colors duration-500 ${active === i ? "text-ink" : "lg:text-ink/25"}`}>
                  {step.title}
                </h3>
                <p className={`mt-4 max-w-md transition-colors duration-500 ${active === i ? "text-ink/65" : "lg:text-ink/25"}`}>{step.body}</p>
                <div className="mt-8 lg:hidden">
                  <Diagram product={product} step={i} />
                </div>
              </li>
            ))}
          </ol>
          <div className="hidden lg:block">
            <div className="card-soft sticky top-[calc(50vh-230px)] rounded-[28px] p-8">
              <Diagram product={product} step={active} />
              <ul className="mt-6 flex flex-col gap-2 text-sm text-ink/60">
                {product.rules.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap justify-center gap-2" aria-label="Stack">
          {product.stack.map((t) => (
            <li key={t} className="glass rounded-xl px-3.5 py-1.5 font-mono text-xs text-ink/70">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
