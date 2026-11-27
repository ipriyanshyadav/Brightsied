"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, View } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { DPR_LOW, EXPOSURE, GL_PROPS, READY_FRAMES, initialDpr } from "./shared";
import { trackPointer } from "./pointer";

// One transparent canvas fixed over the page. Every live tile is a drei <View> that draws
// into its own DOM element's rectangle, so all section tiles share a single WebGL context.
// Frames are driven from GSAP's ticker, the same loop that runs Lenis smooth scrolling, so
// tiles stay locked to their cards while the page scrolls.

// onFallback: the GL context was lost; tiles go back to their stills.
type Props = { onReady: () => void; onFallback: () => void };

function TickerDrive({ onReady }: { onReady: () => void }) {
  const advance = useThree((s) => s.advance);
  const frames = useRef(0);

  useEffect(() => {
    // Added after SmoothScroll's ticker callback, so Lenis has moved the page first.
    const tick = (time: number) => advance(time * 1000);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);

  useFrame(() => {
    if (frames.current < READY_FRAMES && ++frames.current === READY_FRAMES) onReady();
  });
  return null;
}

export default function LiveLayer({ onReady, onFallback }: Props) {
  const [dprMax] = useState(initialDpr);
  const [dpr, setDpr] = useState(dprMax);

  useEffect(() => trackPointer(), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[15]">
      <Canvas
        frameloop="never"
        dpr={dpr}
        gl={GL_PROPS}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = EXPOSURE;
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onFallback();
          });
        }}
        style={{ pointerEvents: "none" }}
      >
        <TickerDrive onReady={onReady} />
        {/* Frame-rate dips lower the resolution; if it keeps flip-flopping, settle on low. */}
        <PerformanceMonitor flipflops={3} onDecline={() => setDpr(DPR_LOW)} onIncline={() => setDpr(dprMax)} onFallback={() => setDpr(DPR_LOW)}>
          <View.Port />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
