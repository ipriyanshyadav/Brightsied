"use client";

import { useEffect, useSyncExternalStore } from "react";
import { isSoundOn, playClick, setSoundOn, SOUND_CHANGE_EVENT } from "@/lib/sound";
import { MotionToggle } from "@/components/ui/MotionToggle";

// Bottom-right corner controls: interface sound (off by default) and pause animations.

/** Elements that click when pressed, while sound is on. */
const CLICKABLE = "button, [role=tab], .btn-3d, .btn-light";

const subscribe = (onChange: () => void) => {
  window.addEventListener(SOUND_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(SOUND_CHANGE_EVENT, onChange);
};

function SoundToggle() {
  const on = useSyncExternalStore(subscribe, isSoundOn, () => false);
  const label = on ? "Turn sound off" : "Turn sound on";
  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      title={label}
      className="glass grid h-10 w-10 place-items-center rounded-full text-ink/75 transition-colors hover:text-ink"
    >
      <span className="sr-only">{label}</span>
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
        <path d="M1 5h2.6L7 2v10L3.6 9H1z" fill="currentColor" />
        {on ? (
          <path d="M10 4.5a3.5 3.5 0 0 1 0 5M12 2.5a6.3 6.3 0 0 1 0 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="m10.5 4.8 4 4.4m0-4.4-4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

export function SiteControls() {
  // One listener for the whole page; it runs after the toggle's own handler, so turning
  // sound on is confirmed with a click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(CLICKABLE)) playClick();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 sm:bottom-6 sm:right-6">
      <SoundToggle />
      <MotionToggle />
    </div>
  );
}
