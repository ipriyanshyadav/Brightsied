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
/**
 * A stage point as an offset in container units (the stage is the query container), so
 * actors move with `translate`, which the browser can animate without re-running layout.
 */
const offset = (x: number, y: number, dx: string, dy: string) =>
  `calc(${pctX(x)}cqw + ${dx}) calc(${(pctY(y) * STAGE_H) / STAGE_W}cqw + ${dy})`;
const halfHeight = (a: CastMember) => (a.type === "bar" ? 0 : (a.size * ASPECT[a.type]) / 2);

const MOVE = "motion-safe:transition-[translate,width,height,opacity,scale,rotate] motion-safe:duration-700 ease-(--ease-out-soft)";

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
  pin: (
    <>
      <path d="M12 18.5s-4.8-4.4-4.8-8.2a4.8 4.8 0 019.6 0c0 3.8-4.8 8.2-4.8 8.2z" />
      <circle cx="12" cy="10.3" r="1.4" />
    </>
  ),
};

const PAPER = "bg-[linear-gradient(180deg,#fff,#eceef2)] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35),inset_0_1px_0_#fff]";

/** A lorry facing right: a white box body, a coloured cab and three wheels. */
function Truck({ fill, shadow }: { fill: string; shadow: string }) {
  return (
    <span className="relative block h-full w-full">
      <span className={`absolute left-0 top-0 h-[78%] w-[68%] rounded-[10%/14%] ${PAPER}`}>
        <span className="absolute inset-x-[10%] top-[42%] h-[14%] rounded-full" style={{ background: fill }} />
      </span>
      <span className="absolute right-0 top-[22%] h-[56%] w-[29%] rounded-[16%_34%_12%_12%]" style={{ background: fill, boxShadow: shadow }}>
        <span className="absolute right-[14%] top-[14%] h-[34%] w-[46%] rounded-[3px_8px_3px_3px] bg-white/85" />
      </span>
      {[16, 52, 84].map((x) => (
        <span key={x} className="absolute bottom-0 aspect-square w-[17%] -translate-x-1/2 rounded-full border-[3cqi] border-[#2a2a30] bg-[#d5d8df]" style={{ left: `${x}%` }} />
      ))}
    </span>
  );
}

/** A phone: dark frame, a white screen with a coloured header and a few lines. */
function Phone({ fill }: { fill: string }) {
  return (
    <span className="flex h-full w-full rounded-[18%/9%] bg-[linear-gradient(160deg,#55555e,#16161a)] p-[7%] shadow-[0_12px_24px_-10px_rgb(0_0_0/0.5)]">
      <span className="flex w-full flex-col gap-[5%] rounded-[12%/6%] bg-white p-[12%]">
        <span className="h-[18%] rounded-[4px]" style={{ background: fill }} />
        {[90, 64, 78, 52].map((w) => (
          <span key={w} className="h-[4%] rounded-full bg-[#d5d8df]" style={{ width: `${w}%` }} />
        ))}
      </span>
    </span>
  );
}

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
        <span className={`flex h-full w-full flex-col gap-[7%] rounded-[12%/9%] p-[9%] ${PAPER}`}>
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
    case "truck":
      return <Truck fill={fill} shadow={shadow} />;
    case "phone":
      return <Phone fill={fill} />;
  }
}

function Actor2D({ a }: { a: CastMember }) {
  const bar = a.type === "bar";
  const style: React.CSSProperties = {
    width: `${pctW(a.size)}%`,
    height: bar ? `${pctH(a.h ?? 0)}%` : undefined,
    aspectRatio: bar ? undefined : `1 / ${ASPECT[a.type]}`,
    translate: offset(a.at[0], a.at[1], "-50%", bar ? "-100%" : "-50%"),
    rotate: a.rot ? `${-a.rot}deg` : undefined,
    opacity: a.shown ? (a.dim ? 0.38 : 1) : 0,
    scale: a.shown ? (a.dim ? 0.9 : 1) : 0.6,
  };
  return (
    <span className={`absolute left-0 top-0 block [container-type:inline-size] ${MOVE}`} style={style}>
      <Shape a={a} />
    </span>
  );
}

function Label({ a }: { a: CastMember }) {
  const right = a.side === "right";
  const style: React.CSSProperties = right
    ? { translate: offset(a.at[0] + a.size / 2 + LABEL_GAP, a.at[1], "0px", "-50%") }
    : { translate: offset(a.at[0], a.at[1] - halfHeight(a) - LABEL_GAP, "-50%", "0px") };
  return (
    <span
      className={`absolute left-0 top-0 whitespace-nowrap text-[clamp(10px,2.6cqi,13px)] font-medium tracking-tight ${MOVE} ${a.dim ? "text-ink/35" : "text-ink/70"}`}
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
