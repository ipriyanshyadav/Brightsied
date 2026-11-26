import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#16181d",
          color: "#f1f0ec",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#9a9da6" }}>
          <span style={{ color: "#f2b33d", marginRight: 6 }}>/</span>
          {site.handle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
          <span>I build backends</span>
          <span style={{ color: "#9a9da6" }}>that LLMs can lean on.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9a9da6" }}>
          {site.name}, {site.role} in {site.location}
        </div>
      </div>
    ),
    size,
  );
}
