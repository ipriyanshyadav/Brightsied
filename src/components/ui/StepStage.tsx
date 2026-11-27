"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GlossyTile, palettes } from "@/components/ui/GlossyTile";
import { useLive } from "@/components/three/LiveProvider";
import { ASPECT, STAGE_H, STAGE_W, flowEnds, flowPoint, stageCast, type BadgeIcon, type CastMember } from "@/lib/scenes";

// The picture beside a product step. It is drawn in 2D first (and stays 2D on reduced-motion
// and low-power devices); once the page's live 3D layer is running, the same scene is drawn
// in 3D into this box and the 2D shapes fade out, leaving their labels on top.

const StageView = dynamic(() => import("@/components/three/StageView"), { ssr: false });

const LABEL_GAP = 0.1;

const pctX = (x: number) => ((x + STAGE_W / 2) / STAGE_W) * 100;
const pctY = (y: number) => ((STAGE_H / 2 - y) / STAGE_H) * 100;
const pctW = (w: number) => (w / STAGE_W) * 100;
const pctH = (h: number) => (h / STAGE_H) * 100;
const halfHeight = (a: CastMember) => (a.type === "bar" ? 0 : (a.size * ASPECT[a.type]) / 2);

const MOVE = "motion-safe:transition-[left,top,width,height,opacity,scale] motion-safe:duration-700 ease-(--ease-out-soft)";

const icons: Record<BadgeIcon, React.ReactNode> = {
  check: <path d="M6.5 12.5l3.6 3.6 7.4-8.2" />,
  alert: <path d="M12 6.5v7M12 17.2v.3" />,
  lock: (
    <>
      <rect x="6.5" y="11" width="11" height="8" rx="2" />
      <path d="M9 11V8.5a3 3 0 016 0V11" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 8.5V12l2.5 1.6" />
    </>
  ),
};

function Gear({ a }: { a: CastMember }) {
  const p = palettes[a.tone];
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={`h-full w-full ${a.shown && !a.dim ? "stage-spin motion-loop" : ""}`} style={{ filter: `drop-shadow(0 4px 8px ${p.glow})` }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.hi} />
          <stop offset="0.5" stopColor={p.base} />
          <stop offset="1" stopColor={p.deep} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="41" y="2" width="18" height="22" rx="5" transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="36" />
      </g>
      <circle cx="50" cy="50" r="12" fill="#fff" />
    </svg>
  );
}

function Shape({ a }: { a: CastMember }) {
  const p = palettes[a.tone];
  const fill = `linear-gradient(160deg, ${p.hi}, ${p.base} 45%, ${p.deep})`;
  const shadow = `0 6cqi 10cqi -4cqi ${p.glow}, inset 0 1px 0 rgb(255 255 255 / 0.6)`;
  switch (a.type) {
    case "tile":
      return <GlossyTile kind={a.tone} sizes="160px" className="h-full w-full" />;
    case "card":
      return (
        <span className="flex h-full w-full flex-col gap-[7%] rounded-[12%/9%] bg-[linear-gradient(180deg,#fff,#eceef2)] p-[9%] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35),inset_0_1px_0_#fff]">
          <span className="h-[20%] rounded-[6px]" style={{ background: fill }} />
          {[82, 60, 72].map((w) => (
            <span key={w} className="h-[6%] rounded-full bg-[#d5d8df]" style={{ width: `${w}%` }} />
          ))}
        </span>
      );
    case "crate":
      return <span className="block h-full w-full rounded-[18%]" style={{ background: fill, boxShadow: shadow }} />;
    case "bar":
      return <span className="block h-full w-full rounded-t-[40%_14%]" style={{ background: fill, boxShadow: shadow }} />;
    case "badge":
      return (
        <span className="grid h-full w-full place-items-center rounded-full" style={{ background: fill, boxShadow: shadow }}>
          <svg viewBox="0 0 24 24" className="h-[70%] w-[70%]" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {a.icon && icons[a.icon]}
          </svg>
        </span>
      );
    case "person":
      return (
        <span className="flex h-full w-full flex-col items-center gap-[5%]">
          <span className="aspect-square w-1/2 rounded-full" style={{ background: fill, boxShadow: shadow }} />
          <span className="w-full flex-1 rounded-t-[45%] rounded-b-[18%]" style={{ background: fill, boxShadow: shadow }} />
        </span>
      );
    case "gear":
      return <Gear a={a} />;
  }
}

function Actor2D({ a }: { a: CastMember }) {
  const bar = a.type === "bar";
  const style: React.CSSProperties = {
    left: `${pctX(a.at[0])}%`,
    top: `${pctY(a.at[1])}%`,
    width: `${pctW(a.size)}%`,
    height: bar ? `${pctH(a.h ?? 0)}%` : undefined,
    aspectRatio: bar ? undefined : `1 / ${ASPECT[a.type]}`,
    translate: bar ? "-50% -100%" : "-50% -50%",
    rotate: a.rot ? `${-a.rot}deg` : undefined,
    opacity: a.shown ? (a.dim ? 0.38 : 1) : 0,
    scale: a.shown ? (a.dim ? 0.9 : 1) : 0.6,
  };
  return (
    <span className={`absolute block [container-type:inline-size] ${MOVE}`} style={style}>
      <Shape a={a} />
    </span>
  );
}

function Label({ a }: { a: CastMember }) {
  const right = a.side === "right";
  const style: React.CSSProperties = right
    ? { left: `${pctX(a.at[0] + a.size / 2 + LABEL_GAP)}%`, top: `${pctY(a.at[1])}%`, translate: "0 -50%" }
    : { left: `${pctX(a.at[0])}%`, top: `${pctY(a.at[1] - halfHeight(a) - LABEL_GAP)}%`, translate: "-50% 0" };
  return (
    <span
      className={`absolute whitespace-nowrap text-[clamp(10px,2.6cqi,13px)] font-medium tracking-tight ${MOVE} ${a.dim ? "text-ink/35" : "text-ink/70"}`}
      style={{ ...style, opacity: a.shown ? 1 : 0 }}
    >
      {a.label}
    </span>
  );
}

function Flows({ cast, flows }: { cast: CastMember[]; flows: [string, string][] }) {
  const byKey = new Map(cast.map((a) => [a.key, a]));
  const pt = ([x, y]: [number, number]) => [(x + STAGE_W / 2) * 100, (STAGE_H / 2 - y) * 100];
  return (
    <svg viewBox={`0 0 ${STAGE_W * 100} ${STAGE_H * 100}`} className="absolute inset-0 h-full w-full" fill="none">
      {flows.map(([from, to]) => {
        const a = byKey.get(from);
        const b = byKey.get(to);
        if (!a || !b) return null;
        const [start, end] = flowEnds(a, flowPoint(a), b, flowPoint(b));
        const [x1, y1] = pt(start);
        const [x2, y2] = pt(end);
        // Bow each line slightly so crossing flows read as separate paths.
        const cx = (x1 + x2) / 2 - (y2 - y1) * 0.18;
        const cy = (y1 + y2) / 2 + (x2 - x1) * 0.18;
        return (
          <path
            key={`${from}>${to}`}
            d={`M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`}
            stroke="var(--color-brand)"
            strokeOpacity="0.45"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 9"
            className="stage-flow motion-loop"
          />
        );
      })}
    </svg>
  );
}

type Props = {
  /** Scene keys of the whole sequence, so actors can move between them. */
  scenes: string[];
  active: number;
  className?: string;
};

export function StepStage({ scenes, active, className = "" }: Props) {
  const live = useLive();
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { cast, flows } = useMemo(() => stageCast(scenes, active), [scenes, active]);

  // A stage hidden by a breakpoint has no size; it gets no 3D view, so it costs nothing.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setVisible(entry.contentRect.width > 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} aria-hidden="true" className={`relative aspect-[4/3] w-full [container-type:inline-size] ${className}`}>
      <div className="live-poster absolute inset-0">
        <Flows cast={cast} flows={flows} />
        {cast.map((a) => (
          <Actor2D key={a.key} a={a} />
        ))}
      </div>
      {live && visible && <StageView cast={cast} flows={flows} />}
      <div className="pointer-events-none absolute inset-0">
        {cast.map((a) => a.label && <Label key={a.key} a={a} />)}
      </div>
    </div>
  );
}
