import "server-only";
import { ImageResponse } from "next/og";

// One look for every social share image: the wordmark, an optional eyebrow, a headline
// whose last line is accented, and a footer line.

export const OG_SIZE = { width: 1200, height: 630 };

const BRAND = "#3b5bff";
const ACCENT = "#9fb2ff";
const MUTED = "#9a9da6";

type Card = { wordmark: string; eyebrow?: string; lines: string[]; footer: string };

export function renderOgCard({ wordmark, eyebrow, lines, footer }: Card) {
  // Long single-line headlines (page titles) get a smaller size so they fit in three lines.
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = longest > 48 ? 60 : 84;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg, #1b1b1f 0%, #0c0c0f 100%)",
          color: "#f4f4f4",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, fontStyle: "italic", letterSpacing: -1.5 }}>
            {wordmark}
            <span style={{ color: BRAND }}>.</span>
          </div>
          {eyebrow && (
            <div style={{ display: "flex", fontSize: 24, color: MUTED, textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize, fontWeight: 600, letterSpacing: -3, lineHeight: 1.04 }}>
          {lines.map((line, i) => (
            <span key={line} style={{ color: i === lines.length - 1 && lines.length > 1 ? ACCENT : undefined }}>
              {line}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: MUTED }}>{footer}</div>
      </div>
    ),
    OG_SIZE,
  );
}
