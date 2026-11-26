"use client";

import { createContext, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { canRun3D } from "@/lib/motion";

// Turns the section tiles into live 3D once the page has settled, on devices that can run
// it. Until then (and for good on reduced-motion or low-power devices) tiles show their
// pre-rendered stills.

const LiveLayer = dynamic(() => import("./LiveLayer"), { ssr: false });

// After the hero's own 3D has had its turn, and only when the browser is idle.
const START_DELAY_MS = 3500;
const IDLE_TIMEOUT_MS = 2000;

type State = "off" | "loading" | "on" | "failed";

const LiveContext = createContext(false);

/** True once tiles should mount their live 3D views. */
export const useLive = () => useContext(LiveContext);

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("off");

  useEffect(() => {
    if (!canRun3D()) return;
    let idle = 0;
    const timer = window.setTimeout(() => {
      const start = () => setState((s) => (s === "off" ? "loading" : s));
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS });
      else start();
    }, START_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  // <html data-live="on"> fades the stills out once the live tiles are drawing.
  useEffect(() => {
    const root = document.documentElement;
    if (state === "on") root.dataset.live = "on";
    else delete root.dataset.live;
  }, [state]);

  const active = state === "loading" || state === "on";

  return (
    <LiveContext.Provider value={active}>
      {children}
      {active && <LiveLayer onReady={() => setState("on")} onFallback={() => setState("failed")} />}
    </LiveContext.Provider>
  );
}
