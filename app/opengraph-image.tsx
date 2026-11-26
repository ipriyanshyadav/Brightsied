import { ImageResponse } from "next/og";
import { getHome, getSettings } from "@/lib/content";

export const alt = "Brightera: software that ships, AI that holds up";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [site, { hero }] = await Promise.all([getSettings(), getHome()]);
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
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, fontStyle: "italic", letterSpacing: -1.5 }}>
          {site.wordmark}
          <span style={{ color: "#3b5bff" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 600, letterSpacing: -3, lineHeight: 1.02 }}>
          {hero.title.map((line, i) => (
            <span key={line} style={{ color: i === hero.title.length - 1 ? "#9fb2ff" : undefined }}>
              {line}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a9da6" }}>
          Product engineering · Forward-deployed engineers · AI systems · {site.location}
        </div>
      </div>
    ),
    size,
  );
}
