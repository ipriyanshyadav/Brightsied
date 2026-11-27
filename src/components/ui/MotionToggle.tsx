"use client";

import { useSyncExternalStore } from "react";
import { REDUCED } from "@/lib/gsap";
import { isMotionPaused, setMotionPaused } from "@/lib/motion";

// Pause/play for everything that moves on its own: floating tiles, colour drift, the
// marquee and the 3D idle motion (WCAG 2.2.2). Hidden when the OS already asks for
// reduced motion, since nothing loops then.

const CHANGE = "motionchange";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  window.addEventListener(CHANGE, onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    mq.removeEventListener("change", onChange);
  };
}

const getPaused = () => isMotionPaused();
const getReduced = () => window.matchMedia(REDUCED).matches;

export function MotionToggle() {
  const paused = useSyncExternalStore(subscribe, getPaused, () => false);
  const reduced = useSyncExternalStore(subscribe, getReduced, () => true);
  if (reduced) return null;

  const toggle = () => {
    setMotionPaused(!paused);
    window.dispatchEvent(new Event(CHANGE));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      title={paused ? "Play animations" : "Pause animations"}
      className="glass grid h-10 w-10 place-items-center rounded-full text-ink/75 transition-colors hover:text-ink"
    >
      <span className="sr-only">{paused ? "Play animations" : "Pause animations"}</span>
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
        {paused ? (
          <path d="M1.5 1.6v10.8a.8.8 0 0 0 1.2.7l8.6-5.4a.8.8 0 0 0 0-1.4L2.7.9a.8.8 0 0 0-1.2.7Z" fill="currentColor" />
        ) : (
          <>
            <rect x="1" y="1" width="3.6" height="12" rx="1.2" fill="currentColor" />
            <rect x="7.4" y="1" width="3.6" height="12" rx="1.2" fill="currentColor" />
          </>
        )}
      </svg>
    </button>
  );
}
