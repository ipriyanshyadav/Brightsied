"use client";

import { useRef } from "react";
import type { Product } from "@/lib/content/types";
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

// The illustrative app window stands up in 3D as it scrolls into view.
export function ProductScreen({ product, className = "" }: { product: Product; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={stage} className={`relative isolate [perspective:1600px] ${className}`}>
      <div aria-hidden="true" className="aurora left-[10%] top-[20%] -z-10 h-[60%] w-[40%] bg-[#7f9bff] opacity-35" />
      <div aria-hidden="true" className="aurora right-[8%] top-[30%] -z-10 h-[50%] w-[35%] bg-[#ffb07a] opacity-30" />
      <AppWindow w={product.window} />
      <p className="mt-3 text-center text-xs text-muted">Illustrative screen with sample data.</p>
    </div>
  );
}
