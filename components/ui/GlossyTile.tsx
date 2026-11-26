import Image from "next/image";

// Glossy 3D "app icon" tiles. Each one stands for a piece of the work:
// documents, vectors, agents, queues, audit logs, APIs, terminals, databases.
//
// The pictures are real renders of the same 3D tiles the hero and section cards draw live
// (components/three), captured by `npm run tiles:render` into public/tiles. They are what
// visitors see first, what reduced-motion and low-power visitors keep, and the small tiles
// inside the Statement headline.

export type TileKind =
  | "docs"
  | "vectors"
  | "agents"
  | "queue"
  | "audit"
  | "api"
  | "terminal"
  | "db";

export type Palette = {
  hi: string; // top light
  base: string;
  deep: string;
  glow: string; // coloured light under the tile
  ink: string; // accent used inside the glyph
};

// Single source for tile colours: the 3D materials and the glow under each picture read this.
export const palettes: Record<TileKind, Palette> = {
  docs: { hi: "#eef4ff", base: "#86abff", deep: "#3d68f0", glow: "rgb(61 104 240 / 0.6)", ink: "#2f57d6" },
  vectors: { hi: "#efe8ff", base: "#9a7bff", deep: "#5a32ee", glow: "rgb(106 69 255 / 0.6)", ink: "#4a24d0" },
  agents: { hi: "#6b6b74", base: "#2a2a30", deep: "#09090b", glow: "rgb(0 0 0 / 0.55)", ink: "#000000" },
  queue: { hi: "#fff6dc", base: "#ffc24a", deep: "#f08a00", glow: "rgb(245 158 11 / 0.6)", ink: "#a85600" },
  audit: { hi: "#e2fdf0", base: "#45d9a0", deep: "#0e9f68", glow: "rgb(24 180 124 / 0.55)", ink: "#0a7a50" },
  api: { hi: "#ffe9e2", base: "#ff8466", deep: "#ee3f1b", glow: "rgb(255 90 60 / 0.6)", ink: "#b8300f" },
  terminal: { hi: "#55555e", base: "#202026", deep: "#060608", glow: "rgb(0 0 0 / 0.55)", ink: "#000000" },
  db: { hi: "#ffffff", base: "#eceef3", deep: "#b7bcc8", glow: "rgb(70 84 120 / 0.45)", ink: "#5a6276" },
};

export const tileGlow = (kind: TileKind) => palettes[kind].glow;

/** Share of a still's width the tile body fills; the rest is room for depth and rotation. */
export const STILL_FILL = 0.68;
/** Resting angle of the stills: turned slightly up and to the left so they read as solid. */
export const STILL_POSE: [number, number, number] = [0.12, -0.18, 0];
/** Pixel size of the rendered stills in public/tiles. */
export const STILL_PX = 768;

// The picture overhangs the tile box so the tile body lines up with the box edges.
const OVERHANG = `${(((1 / STILL_FILL - 1) / 2) * 100).toFixed(2)}%`;

export function GlossyTile({
  kind,
  className = "",
  label,
  sizes = "(min-width: 640px) 220px, 160px",
  eager = false,
  glass = false,
}: {
  kind: TileKind;
  /** The clear glass version of the tile (public/tiles/<kind>-glass.png). */
  glass?: boolean;
  className?: string;
  label?: string;
  /** Rendered width hint for next/image, including the overhang. */
  sizes?: string;
  /** Load immediately (above the fold) instead of lazily. */
  eager?: boolean;
}) {
  return (
    <span
      className={`relative block aspect-square [container-type:inline-size] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span className="absolute" style={{ inset: `-${OVERHANG}` }}>
        <Image
          src={`/tiles/${kind}${glass ? "-glass" : ""}.png`}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          draggable={false}
          className="select-none object-contain"
          style={{ filter: `drop-shadow(0 7cqi 10cqi ${palettes[kind].glow})` }}
        />
      </span>
    </span>
  );
}

// Shared SVG gradients and filters for the small inline controls (dial, faders). Rendered
// once in the layout and kept in the DOM (not display:none) so every icon can reference them.
export function SvgDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="gt-knob" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#d9dbe1" />
          <stop offset="100%" stopColor="#8e939e" />
        </radialGradient>
        <linearGradient id="gt-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a52" />
          <stop offset="100%" stopColor="#0c0c0e" />
        </linearGradient>
        <filter id="gt-soft" x="-30%" y="-30%" width="160%" height="170%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.4" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
