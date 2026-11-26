"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";

// Keeps ScrollTrigger in step with Lenis's virtual scroll position.
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

// Lenis is driven from GSAP's ticker so ScrollTrigger and smooth scroll share one frame loop.
// Users who prefer reduced motion get native scrolling.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<LenisRef>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Read the instance on every tick: Lenis is created after this effect first runs.
    const tick = (t: number) => ref.current?.lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={ref}
      options={{ autoRaf: false, lerp: 0.1, anchors: { offset: -72 } }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
