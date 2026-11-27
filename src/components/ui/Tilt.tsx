"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Largest rotation in degrees at the edges of the area. */
  max?: number;
};

// Tracks the mouse over its area and sets --rx/--ry for descendants, so elements with
// .tilt-3d turn toward the pointer. Touch input and reduced motion leave everything flat.
export function Tilt({ children, className = "", style, max = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(nx * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-ny * max * 2).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    ["--rx", "--ry"].forEach((p) => el.style.removeProperty(p));
  };

  return (
    <div ref={ref} className={className} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
