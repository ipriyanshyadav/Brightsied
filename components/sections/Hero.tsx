"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { hero, site } from "@/lib/content";
import { GlossyTile } from "@/components/ui/GlossyTile";
import type { HeroTile } from "@/components/three/HeroScene";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { canRun3D } from "@/lib/motion";

// The real-time 3D cluster is its own chunk, fetched only after the gate below passes.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

// Canvas box around the cluster (layout px): room for tiles to be shoved about.
const SCENE_W = 1100;
const SCENE_H = 600;
// Wait for the intro and the CSS tiles' drop-in to finish before swapping in 3D.
const SCENE_DELAY_MS = 2800;
const IDLE_TIMEOUT_MS = 1500;

type SceneState = "css" | "loading" | "3d" | "off";

// The floating cluster stands in for a 3D hero object: glossy tiles for each part of the stack,
// one of them clear glass. In 3D they can be grabbed and thrown.
const cluster: HeroTile[] = [
  { kind: "db", x: -214, y: 34, size: 78, r: -14, depth: 0.6 },
  { kind: "docs", x: -120, y: -8, size: 100, r: -7, depth: 1 },
  { kind: "agents", x: 0, y: -28, size: 124, r: 4, depth: 1.4 },
  { kind: "vectors", x: 124, y: 0, size: 96, r: 10, depth: 1.1, glass: true },
  { kind: "queue", x: 218, y: 40, size: 74, r: 16, depth: 0.7 },
  { kind: "terminal", x: -60, y: 92, size: 62, r: 12, depth: 0.5 },
  { kind: "audit", x: 68, y: 98, size: 58, r: -10, depth: 0.45 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scene, setScene] = useState<SceneState>("css");

  useEffect(() => {
    if (!canRun3D()) return;
    let idle = 0;
    const timer = window.setTimeout(() => {
      const start = () => setScene((s) => (s === "css" ? "loading" : s));
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS });
      else start();
    }, SCENE_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current;
        if (!el) return;
        // Pointer parallax plus a 3D turn toward the cursor for the poster tiles.
        const movers = gsap.utils.toArray<HTMLElement>(".hero-tile");
        const setters = movers.map((m) => ({
          x: gsap.quickTo(m, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(m, "y", { duration: 0.9, ease: "power3" }),
          depth: Number(m.dataset.depth),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(nx * 30 * s.depth);
            s.y(ny * 20 * s.depth);
          });
          el.style.setProperty("--ry", `${(nx * 26).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-ny * 22).toFixed(2)}deg`);
        };
        window.addEventListener("pointermove", onMove);

        // On scroll, the cluster lifts away faster than the copy.
        gsap.to(".hero-cluster", {
          yPercent: -45,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-copy", {
          y: -120,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  const last = hero.title.length - 1;

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#e3e4e9_0%,#eeeef1_50%,#f4f4f4_100%)] px-4 pb-24 pt-28 text-center"
    >
      {/* Ambient colour and texture behind everything */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora drift motion-loop left-[8%] top-[10%] h-[340px] w-[340px] bg-[#7f9bff] opacity-45" />
        <div className="aurora drift motion-loop right-[6%] top-[6%] h-[380px] w-[380px] bg-[#b69bff] opacity-40 [animation-delay:-6s]" />
        <div className="aurora drift motion-loop bottom-[6%] left-[30%] h-[260px] w-[420px] bg-[#ffc98a] opacity-35 [animation-delay:-11s]" />
        <div className="aurora right-[24%] top-[38%] h-[200px] w-[220px] bg-[#8ef0c8] opacity-30" />
        <div className="dot-grid absolute inset-0" />
      </div>

      <div className="hero-cluster relative mb-8 h-[220px] w-full max-w-[580px] scale-[0.7] sm:mb-10 sm:scale-100" data-scene={scene}>
        {/* Soft floor shadow the tiles hover over */}
        <div aria-hidden="true" className="absolute left-1/2 top-[78%] h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-2xl" />
        {cluster.map((t, i) => (
          <div
            key={t.kind}
            className="hero-tile hero-css absolute left-1/2 top-1/2"
            data-depth={t.depth}
            style={{ width: t.size, height: t.size, marginLeft: t.x - t.size / 2, marginTop: t.y - t.size / 2 }}
          >
            <div className="hero-drop" style={{ animationDelay: `${1.55 + i * 0.06}s` }}>
              <div
                className="motion-loop hero-bob"
                style={{ animationDelay: `${i * -0.7}s`, ["--r" as string]: `${t.r}deg` }}
              >
                <div className="hero-tilt" style={{ ["--d" as string]: t.depth }}>
                  <GlossyTile kind={t.kind} glass={t.glass} eager sizes="190px" />
                </div>
              </div>
            </div>
          </div>
        ))}
        {(scene === "loading" || scene === "3d") && (
          <div className="hero-3d">
            <HeroScene
              tiles={cluster}
              width={SCENE_W}
              height={SCENE_H}
              onReady={() => setScene("3d")}
              onFallback={() => setScene("off")}
            />
          </div>
        )}
      </div>

      <div className="hero-copy flex flex-col items-center">
        <p className="hero-in glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] text-ink/75" style={{ animationDelay: "1.75s" }}>
          <span className="relative flex h-2 w-2">
            <span className="motion-loop absolute inset-0 animate-ping rounded-full bg-mint/60" />
            <span className="relative h-2 w-2 rounded-full bg-mint shadow-[0_0_8px_2px_rgba(31,191,134,0.6)]" />
          </span>
          {site.status}
        </p>
        <h1 className="mt-6 text-hero font-medium">
          {hero.title.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.1em]">
              <span className="hero-line block" style={{ animationDelay: `${1.6 + i * 0.08}s` }}>
                <span className={i === last ? "text-gradient inline-block pr-[0.04em]" : undefined}>{line}</span>
              </span>
            </span>
          ))}
        </h1>
        <p className="hero-in mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink/70 sm:text-base" style={{ animationDelay: "1.85s" }}>
          {hero.sub}
        </p>
        <div className="hero-in mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "1.95s" }}>
          <a href="#work" className="btn-3d rounded-xl px-5 py-2.5 text-sm font-medium">
            See my work
          </a>
          <a href={`mailto:${site.email}`} className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
            Get in touch
          </a>
        </div>
      </div>

      <style>{`
        .hero-line { animation: hero-rise 1.1s both var(--ease-out-soft); }
        .hero-in { animation: hero-fade 1s both var(--ease-out-soft); }
        .hero-drop { animation: hero-drop 1.3s both var(--ease-out-soft); }
        .hero-bob { transform: rotate(var(--r)); animation: hero-bob 6s ease-in-out infinite; }
        .hero-tilt {
          transform: perspective(600px) rotateX(calc(var(--rx, 0deg) * var(--d))) rotateY(calc(var(--ry, 0deg) * var(--d)));
          transition: transform .8s var(--ease-out-soft);
        }
        @keyframes hero-rise { from { transform: translateY(105%) } }
        @keyframes hero-fade { from { opacity: 0; transform: translateY(14px); filter: blur(4px) } }
        @keyframes hero-drop { from { opacity: 0; transform: translateY(-140px) rotate(-12deg) scale(.8) } }
        @keyframes hero-bob { 0%,100% { transform: translateY(0) rotate(var(--r)) } 50% { transform: translateY(-10px) rotate(calc(var(--r) + 3deg)) } }
        /* Cross-fade: CSS tiles are the poster; the 3D canvas fades in over them once it has drawn. */
        .hero-css { transition: opacity .8s var(--ease-out-soft); }
        .hero-3d { opacity: 0; transition: opacity .8s var(--ease-out-soft); }
        [data-scene="3d"] .hero-3d { opacity: 1; }
        [data-scene="3d"] .hero-css { opacity: 0; }
        @media (prefers-reduced-motion: reduce) { .hero-tilt { transform: none } }
      `}</style>
    </section>
  );
}
