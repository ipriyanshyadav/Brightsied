"use client";

import { memo, startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import type { Product } from "@/lib/content/types";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { LiveTile } from "@/components/ui/LiveTile";
import { StepStage } from "@/components/ui/StepStage";
import { ProductScreen } from "./ProductScreen";
import { StepScroller } from "./StepScroller";

// Every product on the home page. On large screens the section pins and scrolling moves
// sideways through one slide per product; inside a slide each scroll step advances the
// product's journey, with its scene playing in 3D beside the details. Small screens and
// reduced motion get the products one after another, each with its scrolling steps.

const WIDE = `(min-width: 1024px) and ${MOTION_OK}`;
/** Scroll distance, in viewport heights, for each step and for each slide change. */
const STEP_VH = 0.55;
/** Scroll position inside a step that a step link jumps to, so the step is clearly active. */
const STEP_LANDING = 0.35;
/** Height the stage card's text, progress bar and padding take, so the 3D stage fits the screen. */
const STAGE_CHROME = "444px";

type Place = { product: number; step: number };
type Position = "past" | "current" | "next";

/** Timeline units: each product holds one unit per step, then one unit slides to the next. */
function layout(products: Product[]) {
  const starts: number[] = [];
  let t = 0;
  products.forEach((p, i) => {
    starts.push(t);
    t += Math.max(p.steps.length, 1) + (i < products.length - 1 ? 1 : 0);
  });
  return { starts, total: t };
}

function placeAt(products: Product[], starts: number[], time: number): Place {
  for (let i = products.length - 1; i >= 0; i--) {
    if (time < starts[i]) continue;
    const steps = Math.max(products[i].steps.length, 1);
    const into = time - starts[i];
    // During the slide to the next product, switch over halfway.
    if (into >= steps && i < products.length - 1) return into - steps >= 0.5 ? { product: i + 1, step: 0 } : { product: i, step: steps - 1 };
    return { product: i, step: Math.min(Math.floor(into), steps - 1) };
  }
  return { product: 0, step: 0 };
}

/** How far through the current step the reader is, 0 to 1 (full while sliding to the next product). */
const stepFill = (starts: number[], time: number, place: Place) => Math.min(Math.max(time - starts[place.product] - place.step, 0), 1);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A step's progress: done, filling with the scroll, or not reached. The filling one reads
 * --fill, which the scroll handler sets on that element alone (data-fill), so each frame
 * touches only the bars that move.
 */
function fill(i: number, step: number, position: Position) {
  if (position === "past" || i < step) return { value: "100%", live: false };
  if (position === "next" || i > step) return { value: "0%", live: false };
  return { value: "calc(var(--fill, 0) * 100%)", live: true };
}

type SlideProps = { product: Product; index: number; count: number; step: number; position: Position; onStep: (product: number, step: number) => void };

// Memoised: a step change re-renders only the slide whose step or position changed.
const Slide = memo(function Slide({ product, index, count, step, position, onStep }: SlideProps) {
  const scenes = useMemo(() => product.steps.map((s) => s.scene), [product.steps]);
  const current = product.steps[step];
  const last = product.steps.length - 1;

  return (
    <div className="mx-auto grid h-full w-full max-w-[1180px] items-center gap-12 px-8 pb-8 lg:grid-cols-[5fr_6fr] lg:gap-16">
      <div>
        <p className="eyebrow">
          Product {index + 1} of {count} · {product.status}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <LiveTile kind={product.tile} sizes="120px" className="w-14 shrink-0" />
          <h3 className="text-section font-medium">{product.shortName}</h3>
        </div>
        <p className="mt-4 max-w-[46ch] text-ink/65">{product.tagline}</p>

        {/* Titles only, so the list keeps its height as the steps change. */}
        <ol className="mt-7 flex flex-col" aria-label={`How ${product.shortName} works`}>
          {product.steps.map((s, i) => {
            const state = position === "past" || i < step ? "done" : i === step && position === "current" ? "active" : "todo";
            const rail = fill(i, step, position);
            return (
              <li key={s.title} className="relative">
                {i < last && (
                  <span aria-hidden="true" className="absolute bottom-[-4px] left-[25px] top-[38px] w-0.5 overflow-hidden rounded-full bg-ink/10">
                    <span data-fill={rail.live ? "h" : undefined} className="absolute inset-x-0 top-0 rounded-full bg-brand" style={{ height: rail.value }} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onStep(index, i)}
                  aria-current={state === "active" ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left transition-colors duration-300 ${state === "active" ? "bg-white/60 shadow-[inset_0_1px_0_#fff,0_8px_20px_-14px_rgba(0,0,0,0.4)]" : "hover:bg-white/30"}`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-[background-color,color,box-shadow] duration-300 ${
                      state === "active"
                        ? "bg-brand text-white shadow-[0_0_0_4px_rgba(59,91,255,0.15),0_0_18px_2px_rgba(59,91,255,0.45)]"
                        : state === "done"
                          ? "bg-ink text-white"
                          : "bg-white/50 text-ink/45 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className={`text-[17px] font-medium tracking-tight transition-colors duration-300 ${state === "active" ? "text-ink" : state === "done" ? "text-ink/60" : "text-ink/40"}`}>
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/products/${product.slug}`} className="btn-3d inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
            See every module
          </Link>
          <Link href={`/products/${product.slug}#demo`} className="btn-light inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
            Request a demo
          </Link>
        </div>
      </div>

      {/* Sized from the screen height too, so the whole card always fits. */}
      <div className="card-soft mx-auto w-full rounded-[28px] p-6" style={{ maxWidth: `calc((100svh - ${STAGE_CHROME}) * 4 / 3 + 48px)` }}>
        <div className="flex items-start gap-4 px-2">
          <div className="flex shrink-0 items-baseline gap-1.5">
            <span key={step} className="step-swap font-mono text-4xl font-medium leading-none tracking-tight text-brand">
              {pad(step + 1)}
            </span>
            <span className="font-mono text-sm text-ink/40">/ {pad(product.steps.length)}</span>
          </div>
          <div key={step} className="step-swap min-w-0 flex-1">
            <p className="eyebrow">Now showing</p>
            <p className="mt-1 text-base font-medium tracking-tight text-ink">{current?.title}</p>
            <p className="mt-1 line-clamp-3 min-h-[3lh] text-sm leading-relaxed text-ink/60">{current?.body}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-1.5 px-2" aria-hidden="true">
          {product.steps.map((s, i) => {
            const bar = fill(i, step, position);
            return (
              <span key={s.title} className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                <span data-fill={bar.live ? "w" : undefined} className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: bar.value }} />
              </span>
            );
          })}
        </div>
        <StepStage scenes={scenes} active={step} className="mt-2" />
      </div>
    </div>
  );
});

function Horizontal({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [place, setPlace] = useState<Place>({ product: 0, step: 0 });
  const lenis = useLenis();
  const { starts, total } = useMemo(() => layout(products), [products]);
  const fillValue = useRef("0");
  const applyFill = useCallback(() => {
    root.current?.querySelectorAll<HTMLElement>("[data-fill]").forEach((el) => el.style.setProperty("--fill", fillValue.current));
  }, []);
  // A step change moves data-fill to new bars; give them the current value before paint.
  useLayoutEffect(applyFill, [place, applyFill]);

  useGSAP(
    () => {
      const unit = () => window.innerHeight * STEP_VH;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${total * unit()}`,
          pin: true,
          // Lenis already smooths the scroll; a second smoothing layer here made the slides trail behind.
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const time = self.progress * total;
            const next = placeAt(products, starts, time);
            fillValue.current = String(stepFill(starts, time, next));
            applyFill();
            // A step change re-renders the slide; as a transition it never holds up a scroll frame.
            startTransition(() => setPlace((p) => (p.product === next.product && p.step === next.step ? p : next)));
          },
        },
      });
      products.forEach((p, i) => {
        tl.to({}, { duration: Math.max(p.steps.length, 1) });
        if (i < products.length - 1) tl.to(track.current, { xPercent: -100 * (i + 1), duration: 1, ease: "power2.inOut" });
      });
      trigger.current = tl.scrollTrigger ?? null;
    },
    { scope: root, dependencies: [products] },
  );

  // Jump to a product's step: scroll to where the timeline shows it.
  const goTo = useCallback(
    (product: number, step: number) => {
      const st = trigger.current;
      if (!st) return;
      const y = st.start + ((starts[product] + step + STEP_LANDING) / total) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y });
    },
    [lenis, starts, total],
  );

  const stepFor = (i: number) => (i < place.product ? products[i].steps.length - 1 : i > place.product ? 0 : place.step);

  return (
    <div ref={root} className="flex h-[100svh] flex-col overflow-hidden pt-20">
      <div ref={track} className="flex min-h-0 w-full flex-1">
        {products.map((p, i) => (
          <div key={p.slug} className="h-full w-full shrink-0" aria-hidden={i !== place.product} inert={i !== place.product}>
            <Slide
              product={p}
              index={i}
              count={products.length}
              step={stepFor(i)}
              position={i < place.product ? "past" : i > place.product ? "next" : "current"}
              onStep={goTo}
            />
          </div>
        ))}
      </div>
      {/* The product switcher sits in its own row below the slides, so it never covers them. */}
      {products.length > 1 && (
        <div className="flex shrink-0 justify-center pb-6 pt-2">
          <div className="glass flex items-center gap-1 rounded-2xl p-1.5" aria-label="Our products" role="group">
            {products.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i, 0)}
                aria-current={place.product === i ? "true" : undefined}
                className={`rounded-xl px-4 py-2 text-[13px] transition-colors ${place.product === i ? "btn-light text-ink" : "text-ink/60 hover:text-ink"}`}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`.step-swap{animation:step-swap .4s both var(--ease-out-soft)}@keyframes step-swap{from{opacity:0;transform:translateY(5px)}}`}</style>
    </div>
  );
}

function Vertical({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col gap-28 px-4 sm:px-8">
      {products.map((p) => (
        <div key={p.slug} id={`product-${p.slug}`} className="mx-auto w-full max-w-[1180px] scroll-mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{p.status}</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <LiveTile kind={p.tile} sizes="120px" className="w-12 shrink-0" />
              <h3 className="text-section font-medium">{p.name}</h3>
            </div>
            <p className="mx-auto mt-4 max-w-[54ch] text-ink/65">{p.summary}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/products/${p.slug}`} className="btn-3d inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
                See every module
              </Link>
              <Link href={`/products/${p.slug}#demo`} className="btn-light inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
                Request a demo
              </Link>
            </div>
          </div>
          <ProductScreen product={p} className="mt-14" />
          <div className="mt-16">
            <StepScroller steps={p.steps} rules={p.rules} headingLevel="h4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductWalkthrough({ products }: { products: Product[] }) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Pinning changes the page's height, so later scroll animations re-measure.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [wide]);

  if (products.length === 0) return null;

  return (
    <section id="products" aria-labelledby="products-title" className="scroll-mt-24 bg-ground py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
        <p className="eyebrow">Our products</p>
        <BlurReveal id="products-title" className="mt-4 text-hero font-medium">
          Software we build and run ourselves.
        </BlurReveal>
        <p className="mx-auto mt-6 max-w-[54ch] text-ink/65">
          Ready-made platforms, built and supported by the same team you&apos;d work with. Scroll to see how each one works.
        </p>
      </div>
      <div className="mt-16">{wide ? <Horizontal products={products} /> : <Vertical products={products} />}</div>
    </section>
  );
}
